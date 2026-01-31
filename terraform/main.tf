terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"      
    storage_account_name = "tfstatetestjavier"       
    container_name       = "tfstate"                 
    key                  = "prod.terraform.tfstate"  
  }
}

provider "azurerm" {
  features {}
}

# 1. Grupo de Recursos
resource "azurerm_resource_group" "rg" {
  name     = "rg-graphite-backend"
  location = "North Europe"
}

# 2. Azure Container Registry (Aquí se guardarán las imágenes Docker)
resource "azurerm_container_registry" "acr" {
  name                = "acr-test-jsm" # Debe ser único mundialmente (solo letras y números)
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true # Necesario para que el App Service pueda leer la imagen
}

# 3. Plan de App Service (B1 para Docker)
resource "azurerm_service_plan" "plan" {
  name                = "asp-graphite"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# 4. Web App para Contenedores
resource "azurerm_linux_web_app" "webapp" {
  name                = "terraform-docker-deploy-test-jsm" # Debe ser único
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.plan.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    application_stack {
      # Le decimos que use Docker y qué imagen buscar
      docker_image_name   = "${azurerm_container_registry.acr.login_server}/testing-backend:latest"
      docker_registry_url = "https://${azurerm_container_registry.acr.login_server}"
      # Usamos las credenciales de admin del ACR para descargar la imagen
      docker_registry_username = azurerm_container_registry.acr.admin_username
      docker_registry_password = azurerm_container_registry.acr.admin_password
    }
  }

  app_settings = {
    # IMPORTANTE: Spring Boot escucha en 8080, pero Azure espera 80.
    # Esta variable le dice a Azure dónde buscar.
    "WEBSITES_PORT" = "8080" 
  }
}

# 5. Base de Datos PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "postgres" {
  name                   = "db-docker-jsm"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  version                = "13"
  administrator_login    = "testAdmin"
  administrator_password = var.db_password # Se pasa por variable secreta
  storage_mb             = 32768
  sku_name               = "B_Standard_B1ms"
  
  # Importante para ahorrar costes en pruebas
  auto_grow_enabled = false 
}

# 6. Regla de Firewall para permitir acceso desde Azure
# Esta regla es OBLIGATORIA para que el App Service vea la base de datos
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure" {
  name             = "allow-azure-services"
  server_id        = azurerm_postgresql_flexible_server.postgres.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# Definimos la variable de contraseña
variable "db_password" {
  description = "Password for PostgreSQL"
  sensitive   = true
}

# Outputs para que GitHub Actions sepa dónde subir el Docker
output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}
output "acr_name" {
  value = azurerm_container_registry.acr.name
}
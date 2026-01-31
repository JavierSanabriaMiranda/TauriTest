# ETAPA 1: Construcción (Usamos una imagen con Maven para compilar)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compilamos el proyecto y saltamos los tests para ir rápido
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Usamos una imagen muy ligera solo con Java)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copiamos solo el JAR compilado de la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto 8080 (donde escucha Spring Boot)
EXPOSE 8080

# Comando para arrancar
ENTRYPOINT ["java", "-jar", "app.jar"]
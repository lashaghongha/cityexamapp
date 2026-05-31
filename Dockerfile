# ── Stage 1: Build React frontend ────────────────────────────
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build ASP.NET backend ───────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS backend
WORKDIR /app
COPY CityexamappLLL/ ./
# Copy built React into wwwroot
COPY --from=frontend /app/frontend/dist ./wwwroot
RUN dotnet publish -c Release -o /publish

# ── Stage 3: Runtime ─────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app
COPY --from=backend /publish ./

# Upload volume will be mounted at /data by Railway
RUN mkdir -p /data

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DB_PATH=/data/cityexam.db
ENV UPLOAD_ROOT=/data/uploads

ENTRYPOINT ["dotnet", "CityexamappLLL.dll"]

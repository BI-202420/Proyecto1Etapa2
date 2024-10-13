# Proyecto de Clasificación de Textos ODS

## Descripción General

Este proyecto está diseñado para clasificar textos en relación con los Objetivos de Desarrollo Sostenible (ODS). La aplicación permite a los usuarios cargar opiniones o textos, los cuales son clasificados automáticamente en categorías correspondientes a los ODS 3, 4, o 5, mostrando las predicciones y la probabilidad asociada a cada una. Además, cuenta con una funcionalidad de reentrenamiento, que permite mejorar el modelo mediante la carga de nuevos datos.

La solución está compuesta por:
- **Frontend**: Una aplicación en React que provee una interfaz amigable para los usuarios.
- **Backend**: Un servidor en FastAPI que expone los endpoints para realizar predicciones y reentrenar el modelo de clasificación.

## Estructura del Proyecto

- **Frontend (React)**:
  - Interfaz de usuario que permite la carga de textos, visualización de los resultados de las predicciones, y descarga de los mismos.
  - Funcionalidad de reentrenamiento, donde los usuarios pueden cargar nuevos datos para mejorar el modelo.
  - Utiliza **Bootstrap** y **PrimeReact** para estilos y componentes visuales.
  
- **Backend (FastAPI)**:
  - Exposición de endpoints API para recibir textos y devolver predicciones.
  - Endpoint para reentrenar el modelo con nuevos datos cargados por el usuario.
  - Persistencia del modelo en formato `.joblib` para su reutilización en futuras predicciones.

## Características Principales

### 1. Clasificación de Textos
Los usuarios pueden ingresar textos, los cuales son clasificados bajo uno de los ODS seleccionados (ODS 3, 4, o 5). La aplicación muestra los resultados de las predicciones junto con la probabilidad correspondiente.

### 2. Reentrenamiento del Modelo
El modelo puede reentrenarse de manera incremental, permitiendo a los usuarios cargar nuevos datos en formato `.xlsx`. Esto mejora la precisión y el rendimiento del modelo conforme se añaden nuevos datos.

### 3. Visualización de Resultados
Los resultados de las predicciones se presentan en una tabla interactiva, que incluye la opción de descargar los resultados en formato `.xlsx` para un análisis posterior.

## Endpoints Principales

- **/transform**: Recibe un conjunto de textos y devuelve las predicciones y probabilidades asociadas.
- **/fit**: Permite subir un conjunto de textos y etiquetas en un archivo `.xlsx`, con lo que se actualiza el modelo existente.

## Instalación y Configuración

### Requisitos
- **Node.js** y **npm** (para el frontend)
- **Python 3.10** (para el backend)
- **FastAPI** y **Uvicorn** para correr el backend
- **React** para la interfaz de usuario
- **Joblib** para la persistencia del modelo

### Instrucciones de Instalación

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/BI-202420/Proyecto1Etapa2.git app
cd app
```

#### 2. Configuración del Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

El servidor estará disponible en `http://localhost:8000`.

#### 3. Configuración del Frontend (React)

```bash
cd frontend
npm install
npm start
```

La aplicación React estará disponible en `http://localhost:3000`.

### Uso

1. Iniciar el backend (FastAPI) y frontend (React).
2. Acceder a la aplicación en `http://localhost:3000`.
3. Cargar textos para clasificar o entrenar el modelo con nuevos datos.
4. Visualizar y descargar los resultados de las predicciones.
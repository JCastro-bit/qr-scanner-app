# Setup del Entorno de Desarrollo - App React Native/Expo
## Fecha: Noviembre 2024

## Requisitos Previos Instalados
- Node.js v20.15.1
- npm v10.9.0
- OpenJDK version 17.0.11 2024-04-16

## Herramientas y SDKs Necesarios

### 1. Android Studio y SDK
- **Android Studio**: IDE principal para desarrollo Android
- **Componentes SDK instalados**:
  - Android SDK Build-Tools 35
  - Android SDK Platform-Tools 35.0.2
  - Android Emulator
  - Sistema Android 14.0 (API 34)
  - Android SDK Command-line Tools

### 2. Variables de Entorno
```bash
# Variable de sistema ANDROID_HOME
ANDROID_HOME = C:\Users\[usuario]\AppData\Local\Android\Sdk

# Agregar al PATH del sistema
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### 3. CLI Tools Necesarias
```bash
# Instalación de Expo CLI
npm install -g expo-cli

# Instalación de EAS CLI (para builds)
npm install -g eas-cli
```

## Verificación del Entorno

### Comandos de Verificación
```bash
# Verificar Java
java -version
# Resultado esperado: openjdk version "17.0.11" 2024-04-16

# Verificar Node
node -v
# Resultado esperado: v20.15.1

# Verificar npm
npm -v
# Resultado esperado: 10.9.0

# Verificar Android Debug Bridge (adb)
adb version
# Resultado esperado: Android Debug Bridge version 1.0.41
# Version 35.0.2-12147458

# Verificar variable ANDROID_HOME
echo %ANDROID_HOME%
# Resultado esperado: C:\Users\[usuario]\AppData\Local\Android\Sdk
```

## Estructura del Proyecto
```
qr-scanner-app/
├── android/           # Configuración nativa de Android
├── ios/              # Configuración nativa de iOS
├── src/              # Código fuente de la aplicación
├── app.json          # Configuración de la aplicación
├── eas.json          # Configuración de build
└── package.json      # Dependencias y scripts
```

## Dependencias Principales del Proyecto
```json
{
  "dependencies": {
    "expo": "latest",
    "expo-barcode-scanner": "Para el escaneo QR",
    "expo-camera": "Acceso a la cámara",
    "@react-navigation/native": "Para navegación entre pantallas",
    "@react-native-async-storage/async-storage": "Para guardar historial"
  }
}
```

## Notas Importantes
1. Asegurarse de tener suficiente espacio en disco (mínimo 10GB libres)
2. Conexión estable a Internet para las descargas e instalaciones
3. Permisos de administrador para la instalación de software y configuración de variables de entorno
4. Se recomienda reiniciar el sistema después de configurar las variables de entorno

## Troubleshooting Común
- Si `adb` no es reconocido, verificar la variable PATH
- Si el build falla, verificar que todos los componentes del SDK estén instalados
- Para problemas con el emulador, verificar la virtualización en BIOS
- En caso de errores con Expo, limpiar cache: `expo start -c`



---

## Welcome to your Expo app 👋


This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

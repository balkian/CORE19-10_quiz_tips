# Comprobador Automático CORE19-10_quiz_tips

Puede descargar este proyecto en el ordenador local de dos formas:
1. Clonar el  comprobador con el comando `git clone ..`
2. Entrar al  comprobador con el navegador y descargar el fichero del proyecto ZIP con un botón.

El proyecto se descarga, instala y ejecuta en el ordenador local con los siguientes comandos:

```sh
$ ## El .zip del proyecto puede descargarse y descomprimirse.
$ ## O el proyecto también puede copiarse en el ordenador local con:
$ git clone https://github.com/practicas-ging/CORE19-10_quiz_tips
$
$ cd CORE19-10_quiz_tips  ## Entrar en el directorio de trabajo del programa de test
$
$ npm install  ## Instala el programa de test, que es un paquete npm
$
$ npm run checks  ## Pasa los tests sobre el repositorio en github
......................................... ## indicando que partes  están correctamente
......................................... ## implementadas y cuales no.
... (resultado de los tests)
```

Los tests pueden pasarse tantas veces como sea necesario; incluso con el ejercicio incompleto.
El programa-de-test incluye además un comando para generar el fichero ZIP

```bash
$
$ npm run zip ## Este comando comprime los ficheros a entregar como un fichero xx.zip
$             ## El directorio de trabajo contiene ahora el fichero: CORE19-10_quiz_tips.zip
```

El fichero `CORE19-10_quiz_tips.zip` contiene los ficheros de la practica comprimidos y puede subirse a la plataforma para su evaluación.


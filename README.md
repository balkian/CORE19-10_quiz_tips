# Comprobador Automático CORE19-10_quiz_tips

Recuerde que para utilizar el validador se debe tener node.js (y npm) (https://nodejs.org/es/) y Git
instalados. El proyecto se descarga e instala en el ordenador local con estos comandos:

```
$                                 ## El proyecto debe clonarse en el ordenador local 
$ git clone https://github.com/practicas-ging/CORE19-10_quiz_tips
$
$ cd CORE19-10_quiz_tips               ## Entrar en el directorio de trabajo
$
$ npm install                                ## Instala el programa de test
$
```

Una vez clonado e instalado el proyecto, ya se puede añadir código al esqueleto, pasar los test o
arrancar el servidor para acceder con un navegador.                

Los tests se pueden ejecutar con:

```
$
$ npm run checks                             ## Pasa los tests al fichero solicitado
.........................................    ## en el directorio de trabajo
.........................................
... (resultado de los tests)
$ 
```

Los tests pueden pasarse las veces que sea necesario. Si se pasan nada más descargar el proyecto, los test fallaran. 
También pueden utilizarse para probar el programa de otro compañero sustituyendo los ficheros que se desee probar.
El programa de test incluye además un comando para generar el fichero ZIP

```
$
$ npm run zip         ##  Comprime los ficheros del directorio en un fichero .zip
$ 
```

Este genera el fichero CORE19-10_quiz_tips_entregable.zip con el directorio de la
practica comprimido. Este fichero ZIP debe subirse a la plataforma para su evaluación.
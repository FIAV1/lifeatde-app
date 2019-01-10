# LifeAtDE - APP
An academic React application built by students for the students of the Ferrara's Department of Engineering.
Since it is a frontend only application, we've also build the server counterpart in [Ruby on Rails](https://rubyonrails.org/) which you can find [here](https://github.com/NicFontana/lifeatde-api).

:books: *__Disclaimer__* :books:

The project was born from one of our ideas and aims to fulfill the requests of the Concurrent Programming Laboratory course, i.e. it is not a platform associated with the University of Ferrara.

## Demo
A demo is available at [https://lifeatde.herokuapp.com](https://lifeatde.herokuapp.com)

Login available with:
* Username: ```john.doe@student.unife.it```
* Password: ```password```

## Goal
Build a mobile first Web Application that allows, quickly and intuitively, to:
* Look for other students to collaborate with to carry out extra-curricular projects encouraging ideas and knowledge sharing
* Sell and exchange teaching materials
* Create study groups
* Stay informed about the news of the Department

## Under the hood
[Material-UI](https://material-ui.com/) is the React UI framework used for this project. [React Router](https://reacttraining.com/react-router/) has been used for the routing. [Formik](https://jaredpalmer.com/formik) did the trick for handling forms and their validations, where [CKEditor](https://ckeditor.com/) gave the boost to project's description.

## Install and Run

**Requirements**

* [Node.js](https://nodejs.org/it/)
* [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/lang/en/)

Clone or download this repository, open a new terminal inside the project directory, then:

1. Install its dependencies with ```yarn``` or ```yarn install```. If you prefer using npm, you need first to delete ```yarn.lock``` then use ```npm i``` or ```npm install``` to install its dependencies (this will generate a ```package-lock.json``` file)
2. *Skip this step if you already installed the backend application*: follow server side instruction written [here](https://github.com/NicFontana/lifeatde-api)
3. To begin the development, run ```yarn start``` or ```npm start```
4. To create a production bundle, use ```yarn build``` or ```npm run build```

Login available with:
* Username: ```john.doe@student.unife.it```
* Password: ```password```

## Team :rocket:
* [Niccolò Fontana](https://github.com/NicFontana)
* [Federico Frigo](https://github.com/xBlue0)
* [Giovanni Fiorini](https://github.com/GiovanniFiorini)

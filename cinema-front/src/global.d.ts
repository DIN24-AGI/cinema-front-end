//This file exoprts an object containing string class names whenever there is an import of .module.css 
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss";
declare module "*.module.sass";

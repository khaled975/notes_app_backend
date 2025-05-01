module.exports = (asyncControllerFn) => {
  return (req, res, next) => {
    asyncControllerFn(req, res, next).catch((error) => next(error));
  };
};

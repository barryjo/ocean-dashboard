const requestInterceptor = (req, res, next) => {
    //log requests
    console.log(`${req.method} : ${JSON.stringify(req.query)}`);
    next();
}

export { requestInterceptor };
/**
 * error handling middleware module
 */

const handleErrors = (error, req, res, next) => {
    if(error){
        let resp = {}; 
        let message = error.message ? error.message : error;
    
        resp.success = false;
        resp.message = message;
        res.status(500).json(resp);
        next();
    }
}


export { handleErrors } 
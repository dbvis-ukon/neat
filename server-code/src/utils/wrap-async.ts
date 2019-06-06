// taken from here: https://dimsolution.com/blog/2019-02-12/how-to-use-async-await-functions-with-express/

export const wrapAsync = (fn) => {
    return (req, res, next) => {
        const fnReturn = fn(req, res, next);

        return Promise.resolve(fnReturn).catch(next);
    }
};
// asyncHandler is = to an async funtion that takes a req, res, next and returns a promise that tries to resolve and if an error occurs catch will return an error.
const asyncHandler = (fn) => (req, res, next) => {
  //If the async function resolves, no problem, if it is rejected we catch it and respond with the error.
    Promise.resolve(fn(req, res, next)).catch((error) => {
        res.status(500).json({ message: error.message });
    });
};

export default asyncHandler;
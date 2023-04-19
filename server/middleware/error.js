module.exports = function(err, req, res, next) {
    console.log("Error caught");
    res.status(500).send("Something failed");
}
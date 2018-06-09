exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/timePlanner-app';
// exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
//                       'mongodb://localhost/test-timePlanner-app';
exports.PORT = process.env.PORT || 8080;
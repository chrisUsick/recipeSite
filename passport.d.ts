declare module "passport" {

    function use(name: string, strategy);
    function use(strategy)

    function unuse(name: string);

    function framework(fw: string);

    function initialize(options: Object);
    function initialize();

    function session(options: Object);
    function session()

    function authenticate(strategy: any, options?: { successRedirect: string, failureRedirect: string }, callback?: Function);

    function authorize(strategy, options, callback);

    function serializeUser(fn, done);

    function deserializeUser(fn, done);

    function transformAuthInfo(fn, done);
} 
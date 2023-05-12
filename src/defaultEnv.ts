export default function configDefaultEnv() {
    if (process.env.SECRET_KEY === undefined) {
        process.env.SECRET_KEY = '';
    }
}
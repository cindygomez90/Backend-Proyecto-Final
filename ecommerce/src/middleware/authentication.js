/*const authorization = (roleArray) => {
    return async (req, res, next) => {
        if (roleArray[0] === 'PUBLIC') return next()

        if (!req.user) return res.status(401).json({status: 'error', error: 'Unhautoried'})
        if (!roleArray.includes(req.user.role)) return res.status(403).json({status: 'error', error: 'Not permissions'})
        
        
        next()
    }
}
*/
const authorization = (roleArray) => {
    return async (req, res, next) => {
        console.log('Usuario después de la autenticación:', req.user);
        console.log('Roles permitidos:', roleArray);

        if (roleArray[0] === 'PUBLIC') return next();

        if (!req.user) return res.status(401).json({ status: 'error', error: 'Unauthorized' });
        if (!roleArray.includes(req.user.role)) return res.status(403).json({ status: 'error', error: 'No permissions' });

        next()
    }
}


module.exports = { authorization }

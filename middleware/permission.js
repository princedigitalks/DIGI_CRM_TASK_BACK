const checkPermission = (panel, action) => {
    return (req, res, next) => {
        // Admins have full access to everything (handled in authMiddleware by populating req.permissions)
        // Here we just check if the required action is allowed in the permissions object

        if (!req.permissions || !req.permissions[panel]) {
            return res.status(403).json({
                status: "Fail",
                message: `You do not have permission to access ${panel} panel.`
            });
        }

        const perms = req.permissions[panel];

        // If check is for 'read', allow if either 'read_all' or 'read_own' is true
        if (action === 'read') {
            if (perms.read_all || perms.read_own) {
                return next();
            }
        } else if (perms[action]) {
            return next();
        }

        return res.status(403).json({
            status: "Fail",
            message: `You do not have permission to ${action} in ${panel} panel.`
        });
    };
};

module.exports = { checkPermission };

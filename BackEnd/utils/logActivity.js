const AuditLog = require("../model/auditlogModel");

async function logActivity(userId, action, details) {
    try {
        const auditLog = new AuditLog({
            userId: userId,
            action: action,
            details: details,
        });
        await auditLog.save();
        console.log('Activity logged:', action);
    } catch (err) {
        console.error('Error logging activity:', err);
    }
}

module.exports = logActivity;

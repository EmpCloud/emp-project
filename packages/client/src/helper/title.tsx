export const displayTitle = function (path: string) {
    switch (path) {
        case '/':
            return 'Home';
        case '/w-m/dashboard':
            return 'Dashboard';
        case '/w-m/tasks/all':
            return 'Tasks';
        case '/w-m/projects/all':
            return 'Projects';
        case '/w-m/projects/create':
            return 'Create Project';
        case '/w-m/tasks/review':
            return 'Workflow | Boards';
        case '/w-m/members/all':
            return 'Members';
        case '/w-m/members/roles':
            return 'Roles';
        case '/w-m/tasks/create':
            return 'Create Tasks';
        case '/w-m/cofiguration':
            return 'Cofiguration';
        case '/w-m/tasks/[id]':
            return 'View | Task';
        case '/w-m/projects/[id]':
            return 'View | Projects';
        case '/w-m/config/task':
            return 'Task Config';
        case '/w-m/pricing':
            return 'Pricing';
        case '/w-m/member/login':
            return 'Member | Login';
        case '/w-m/member/member-email-verification':
            return 'Email | Verification';
        case '/w-m/admin/forgot-password':
            return 'Forgot | Password';
        case '/w-m/member/forgot-password':
            return 'Forgot | Password';
        case '/w-m/admin/reset-password':
            return 'Reset | Password';
        case '/w-m/history':
            return 'History';
        case '/w-m/chat':
            return 'Chat';
        case '/w-m/timeline/global':
            return 'Time Line';
        case '/w-m/reports/projects':
            return 'Project | Reports';
        case '/w-m/permisssions/all':
            return 'Permissions';
        case '/w-m/admin/sign-in':
            return 'Admin | Login';
        case '/w-m/members/client':
            return 'Clients';
        case '/w-m/member/view':
            return 'Member | View';
        case '/w-m/members/restoreUsers':
            return 'Restore | Users';
        case '/w-m/members/groups':
            return 'Groups';
        case '/w-m/members/suspendedusers':
            return 'Suspended | Users';
        default:
            return 'EMP';
    }
};

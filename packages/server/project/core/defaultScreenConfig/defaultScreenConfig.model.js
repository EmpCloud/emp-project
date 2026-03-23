import mongoose from 'mongoose';

const PropSchema = new mongoose.Schema({
    name: {type:String, },
    value: {type:String },
    sort: { type: String, enum: ['ASC', 'DESC',null], default: 'ASC' },
    isDisabled: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    sortingOrder: {type:String}
});

const defaultScreenSchema = new mongoose.Schema({
    adminId: { type: String },
    userId: {type: String},
    project: {
        projectName: { type: PropSchema, default: () => ({name:'Project Name',value:'projectName',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        projectCode: { type: PropSchema, default: () => ({name:'Project Code',value:'projectCode',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        description: { type: PropSchema, default: () => ({name:'Description',value:'description',sortingOrder:'Aa-Zz'}) },
        startDate: { type: PropSchema, default: () => ({name:'Start Date',value:'startDate',sortingOrder:'Date:01-31'}) },
        endDate: { type: PropSchema, default: () => ({name:'End Date',value:'endDate',sortingOrder:'Date:01-31'}) },
        owner: { type: PropSchema, default: () => ({name:'Owner',value:'owner',sort:null,sortingOrder:'Aa-Zz'}) },
        manager: { type: PropSchema, default: () => ({name:'Manager',value:'manager',sort:null,sortingOrder:'Aa-Zz'}) },
        actualBudget: { type: PropSchema, default: () => ({name:'Actual budget',value:'actualBudget',sortingOrder:'numbers:0-10000...'}) },
        plannedBudget: { type: PropSchema, default: () => ({name:'Planned budget',value:'plannedBudget',sortingOrder:'numbers:0-10000...'}) },
        taskCount: { type: PropSchema, default: () => ({name:'Tasks',value:'taskCount',sortingOrder:'numbers:0-100...'}) },
        members: { type: PropSchema, default: () => ({name:'Assigned to',value:'userAssigned',sort:null,isDisabled:true,sortingOrder:'Aa-Zz'}) },
        progress: { type: PropSchema, default: () => ({name:'Progress',value:'progress',sortingOrder:'per:0-100%'}) },
        status: { type: PropSchema, default: () => ({name:'Status',value:'status',sortingOrder:'Aa-Zz'}) },
        clientName: { type: PropSchema, default: () => ({name:'Client Name',value:'clientName',sortingOrder:'Aa-Zz'}) },
        completedDate: { type: PropSchema, default: () => ({name:'Completed Date',value:'completedDate',sortingOrder:'Date:01-31'})},
        reason: { type: PropSchema, default: () => ({name:'Reason',value:'reason',sort:null,sortingOrder:'Aa-Zz'})},
        clientCompany: { type: PropSchema, default: () => ({name:'Client Company',value:'clientCompany',sortingOrder:'Aa-Zz'}) },
        projectCreatedBy: { type: PropSchema, default: () => ({name:'Created By',value:'projectCreatedBy',sortingOrder:'Aa-Zz'}) },
        createdAt: { type: PropSchema, default: () => ({name:'Created At',value:'createdAt',sortingOrder:'Date:01-31'}) },
        updatedAt: { type: PropSchema, default: () => ({name:'Updated At',value:'updatedAt',sortingOrder:'Date:01-31'}) },
        action: { type: PropSchema, default: () => ({name:'Action',value:'action',isDisabled:true,sort:null}) },
    },
    task: {
        projectName: { type: PropSchema, default: () => ({name:'Project',value:'projectName',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        taskTitle: { type: PropSchema, default: () => ({name:'Task',value:'taskTitle',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        createdBy: { type: PropSchema, default: () => ({name:'Created By',value:'createdBy',sortingOrder:'Aa-Zz'}) },
        priority: { type: PropSchema, default: () => ({name:'Priority',value:'priority',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        createdAt: { type: PropSchema, default: () => ({name:'Created At',value:'createdAt',sortingOrder:'Date:01-31'}) },
        dueDate: { type: PropSchema, default: () => ({name:'Due date',value:'dueDate',sortingOrder:'Date:01-31'}) },
        completedDate: { type: PropSchema, default: () => ({name:'Completed Date',value:'completedDate',sortingOrder:'Date:01-31'})},
        reason: { type: PropSchema, default: () => ({name:'Reason',value:'reason',sort:null,sortingOrder:'Aa-Zz'})},
        estimationTime: { type: PropSchema, default: () => ({name:'Est.Time',value:'estimationTime',sortingOrder:'Time:00-24'}) },
        estimationDate: { type: PropSchema, default: () => ({name:'Est.Date',value:'estimationDate',sortingOrder:'Date:01-31'}) },
        members: { type: PropSchema, default: () => ({name:'Assigned to',value:'assignedTo',sort:null,isDisabled:true,sortingOrder:'Aa-Zz'}) },
        taskType: { type: PropSchema, default: () => ({name:'Task type',value:'taskType',sortingOrder:'Aa-Zz'}) },
        category: { type: PropSchema, default: () => ({name:'Category',value:'category',sortingOrder:'Aa-Zz'}) },
        taskStatus: { type: PropSchema, default: () => ({name:'Status',value:'taskStatus',sortingOrder:'Aa-Zz'}) },
        stageName: { type: PropSchema, default: () => ({name:'Stage',value:'stageName',sortingOrder:'Aa-Zz'}) },
        progress: { type: PropSchema, default: () => ({name:'Progress',value:'progress',sortingOrder:'per:0-100%'}) },
        action: { type: PropSchema, default: () => ({name:'Action',value:'action',isDisabled:true,sort:null}) },
    },
    member: {
        firstName: { type: PropSchema, default: () => ({name:'Name',value:'firstName',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        email: { type: PropSchema, default: () => ({name:'Email',value:'email',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        projectCount: { type: PropSchema, default: () => ({name:'Project Count',value:'projectCount',sortingOrder:'Number:0-100...'}) },
        taskCount: { type: PropSchema, default: () => ({name:'Task Count',value:'taskCount',sortingOrder:'Number:0-100...'}) },
        role: { type: PropSchema, default: () => ({name:'Assign Role',value:'role',sortingOrder:'Aa-Zz'}) },
        permission: { type: PropSchema, default: () => ({name:'Permission',value:'permission',sortingOrder:'Aa-Zz'}) },
        performance: { type: PropSchema, default: () => ({name:'Performance',value:'performance',sortingOrder:'0-100%'}) },
        action: { type: PropSchema, default: () => ({name:'Action',value:'action',isDisabled:true,sort:null}) },
    },
    group: {
        groupName: { type: PropSchema, default: () => ({name:'Group Name',value:'groupName',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        assignedMembers: { type: PropSchema, default: () => ({name:'Assign To',value:'assignedMembers',sort:null,isDisabled:true,sortingOrder:'Aa-Zz'}) },
        action: { type: PropSchema, default: () => ({name:'Action',value:'action',isDisabled:true,sort:null}) },
    },
    permission: {
        permissionName: { type: PropSchema, default: () => ({name:'Permission Name',value:'permissionName',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        isDefault: { type: PropSchema, default: () => ({name:'is Default',value:'isDefault',sortingOrder:'Aa-Zz'}) },
        createdAt: { type: PropSchema, default: () => ({name:'Created At',value:'createdAt',sortingOrder:'Date:01-31'}) },
        updatedAt: { type: PropSchema, default: () => ({name:'Updated At',value:'updatedAt',sortingOrder:'Date:01-31'}) },
        action: { type: PropSchema, default: () => ({name:'Action',value:'action',isDisabled:true,sort:null}) },
    },
    role: {
        roles: { type: PropSchema, default: () => ({name:'Role Name',value:'roles',isDisabled:true,sortingOrder:'Aa-Zz'}) },
        AssignedUserRole: { type: PropSchema, default: () => ({name:'Role Assign Members',value:'AssignedUserRole',sort:null,isDisabled:true,sortingOrder:'Aa-Zz'}) },
    },
});

export default mongoose.model('DefaultScreen', defaultScreenSchema);


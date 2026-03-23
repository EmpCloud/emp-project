export const steps = function (path: string) {
    switch (path) {
        case '/w-m/tasks/all':
            return [
                // {
                //   selector: "#step1",
                //   content: "For create Task",
                // },
                //  {
                //   selector: "#step2",
                //   content: "For create sub-Task",
                // },
                //  {
                //   selector: "#step3",
                //   content: "Download as pdf/excel",
                // },
            ];
        default:
            return [{}];
    }
};

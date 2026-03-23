module.exports = {
    darkMode: 'class',
    content: [
        './src/**/**/**/**/*.tsx',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './sections/**/*.{js,ts,jsx,tsx}',
        './modules/**/*.{js,ts,jsx,tsx}',
        './.next/server/pages/**/*.{js,ts,jsx,tsx}',
        './.next/server/pages/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        // screens: {
        //     // xs: '300px',
        //     xs: { max: '480px' },
        //     // => @media (min-width: 300px) { ... }
        //     sm: '480px',
        //     maxsm: { max: '676px' },
        //     // => @media (min-width: 480px) { ... }
        //     maxmd: { max: '760px' },
        //     // => @media (max-width: 760px) { ... }
        //     md: '760px',
        //     // => @media (min-width: 760px) { ... }
        //     maxlg: { max: '976px' },
        //     // => @media (max-width: 976px) { ... }
        //     lg: '976px',
        //     // => @media (min-width: 976px) { ... }
        //     xl: '1440px',
        //     // => @media (min-width: 1440px) { ... }
        // },
        fontSize:{
            sm:'10px',
            base:'12px',
            md:'14px',
            lg: '16px',
            xl:'18px',
            '2xl':'24px',
            '3xl':'28px',
        },
        extend: {
            gridTemplateColumns: {
                'chat-grid': '17% 78%',
                seventyByTwenty: '70% 29%',
            },
            colors: {
                dashboardBg: 'var(--dashboardBg)',
                white: 'var(--white)',
                /* Text */
                darkTextColor: 'var(--darkTextColor)',
                defaultTextColor: 'var(--defaultTextColor)',
                lightTextColor: 'var(--lightTextColor)',
                placeholderGrey: 'var(--placeholderGrey)',
                veryDarkGrey: 'var(--veryDarkGrey)',
                /* Grey */
                lightGrey: 'var(--lightGrey)',
                darkGrey: 'var(--darkGrey)',
                veryLightGrey: 'var(--veryLightGrey)',
                veryveryLightGrey: 'var(--veryveryLightGrey)',
                /* Blue */
                veryLightBlue: 'var(--veryLightBlue)',
                lightBlue: 'var(--lightBlue)',
                /* Priority */
                priority1bg: 'var(--priority1bg)',
                priority2bg: 'var(--priority2bg)',
                priority3bg: 'var(--priority3bg)',
                // Brand Blue
                brandBlue: '#3d9eed',
                mediumBlue: '#7fccff',
                darkBlue: '#3d83ed',
                // Blue 2
                blue2: '#0685D7',
                lightBlue2: '#49ABEA',
                // Red, Green, Yellow
                redColor: '#FC4343',
                lightRedColor: '#FF5959',
                greenColor: '#4BE23E',
                yellowColor: '#FDFF94',
                offlineColor: '#F5997B',
                // Priority Color
                priority1Color: '#FF5959',
                priority2Color: '#F8AF41',
                priority3Color: '#3DADFF',
                progressiveBar: '#66CDDA',
            },
            boxShadow: {
                custom: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                'inner-table-row': ' inset 0px 3px 5px #b0b0c0b0, inset 0px -5px 5px #ffffff',
            },
            fontFamily: {
                // mulish: 'Mulish',
                // for heaing
                // maven: 'Inter',
                // for normal
                // montserrat: 'Montserrat',
                // houschka: "Houschka Pro",
                inter: "Inter"
            },
        },
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
};

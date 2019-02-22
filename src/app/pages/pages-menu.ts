import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'nb-home',
        link: '/pages/dashboard',
        home: true,
    },
    {
        title: 'FEATURES',
        group: true,
    },
    {
        title: 'Entities',
        icon: 'nb-compose',
        children: [
            {
                title: 'Image',
                link: '/pages/forms/image-upload',
            },
            {
                title: 'Step with image',
                link: '/pages/forms/stepImage',
            },
            {
                title: 'Step with script',
                link: '/pages/forms/stepScript',
            },
            {
                title: 'Pipeline',
                link: '/pages/forms/pipeline',
            }, {
                title: 'Device',
                link: '/pages/forms/device',
            },
            {
                title: 'Capability',
                link: '/pages/forms/capability',
            },
            {
                title: 'Run',
                link: '/pages/forms/run',
            },
            {
                title: 'Run Output',
                link: '/pages/forms/runOutput',
            },
        ],
    },
//    {
//        title: 'Nifi',
//        icon: 'nb-shuffle',
//        children: [
//            {
//                title: 'Processor',
//                link: '/pages/forms/nifi',
//            },
//            ],
//    },
];

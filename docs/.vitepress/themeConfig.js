export const themeConfig = {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
        { text: 'Home', link: '/' },
        { text: 'Map', link: '/map' },
        { text: 'Data', link: '/data' },
        { text: 'Team', link: '/team' },
        { text: 'Publications', link: '/publications' },
        { text: 'News', link: '/News' },
        {
            text: 'About',
            items: [
              { text: 'Contact Us', link: '/contact' },
              { text: 'Acknowledgement', link: '/acknowledgment' },
            ]
        }
    ],

    logo: '/logo.png',
    
    head: [['link', { rel: 'icon', href: './HKebus/favicon.ico' }]],
    
    footer: {
        copyright: 'HKeBus © 2025 | <a href="https://thetipteam.editorx.io/website/">The TIP Research Group</a> @ <a href="https://www.polyu.edu.hk/"> HKPolyU </a>'
    },

    // search: {
    //     provider: 'local',
    // }
}

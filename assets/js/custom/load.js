// window.addEventListener('load', function() {
//     window.baunfire.ready();
// });

jQuery(document).ready(function () {
    window.baunfire.ready();
});

// jQuery(window).on("load", function () {
//     // window.baunfire.load();
// });

// window.resizeTimer;
// window.windowWidth = jQuery(window).width();

// window.isTouchDevice = () => {
//     return window.matchMedia("(pointer: coarse), (hover: none)").matches;
// }

// window.deviceType = window.isTouchDevice();

// window.resizeObserver = () => {
//     if (jQuery(window).width() !== window.windowWidth) {
//         // if (window.deviceType != window.isTouchDevice()) {
//         //     window.deviceType = window.isTouchDevice();

//         //     if (window.isTouchDevice()) {
//         //         if (!app.gblaze) return;
//         //         app.gblaze.destroy();
//         //         app.gblaze = null;
//         //     } else {
//         //         if (!app.gblaze) return;
//         //         app.gblaze = SmoothScroll({
//         //             keyboardSupport: false,
//         //             animationTime: 800,
//         //             stepSize: 50,
//         //             keyboardSupport: true,
//         //             arrowScroll: 50,
//         //             touchpadSupport: true,
//         //         });
//         //     }
//         // }
    
//         window.windowWidth = jQuery(window).width();
//         clearTimeout(window.resizeTimer);
//         window.scrollTo(0, 0);

//         // if (window.deviceType != window.isTouchDevice()) {
//         //     window.location.reload();
//         // } else {
//             // window.windowWidth = jQuery(window).width();
//             // clearTimeout(window.resizeTimer);
//             // window.scrollTo(0, 0);
//         // }
//     }
// };

// jQuery(window).on("resize", function () {
//     window.resizeObserver();
// });
import * as React from 'react';
import { SVGAttributes } from 'react';


interface YoutubeProps extends SVGAttributes<HTMLOrSVGElement> { }

export function Youtube (props: YoutubeProps): JSX.Element {
    return (
        <svg {...props} width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.4656 0C26.5783 0 33.9656 7.3873 33.9656 16.5C33.9656 25.6127 26.5783 33 17.4656 33C8.35288 33 0.965576 25.6127 0.965576 16.5C0.965576 7.3873 8.35288 0 17.4656 0ZM8.75925 9.16803C10.5046 8.7145 17.4587 8.71449 17.4587 8.71449C17.4587 8.71449 24.4266 8.71451 26.1719 9.19553C27.1202 9.44291 27.876 10.1987 28.1233 11.147C28.6043 12.8923 28.5906 16.5206 28.5906 16.5206C28.5906 16.5206 28.5906 20.1351 28.1233 21.8668C27.876 22.8288 27.1202 23.5709 26.1719 23.832C24.4266 24.2855 17.4587 24.2855 17.4587 24.2855C17.4587 24.2855 10.5184 24.2855 8.75925 23.8182C7.81097 23.5571 7.05519 22.8013 6.79407 21.853C6.34055 20.1351 6.34054 16.5069 6.34054 16.5069C6.34054 16.5069 6.34055 12.8923 6.79407 11.147C7.05519 10.1987 7.82471 9.42914 8.75925 9.16803ZM21.032 16.5069L15.246 13.1673V19.8327L21.032 16.5069Z" fill="url(#paint0_radial_3263_5486)"/>
<defs>
<radialGradient id="paint0_radial_3263_5486" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.965576) rotate(45) scale(46.669 83.0709)">
<stop stop-color="#F7D21E"/>
<stop offset="1" stop-color="#FBE216"/>
</radialGradient>
</defs>
</svg>

    )
}
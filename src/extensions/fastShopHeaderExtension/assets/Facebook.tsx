import * as React from 'react';
import { SVGAttributes } from 'react';


interface FacebookProps extends SVGAttributes<HTMLOrSVGElement> { }

export function Facebook (props: FacebookProps): JSX.Element {
    return (
        <svg {...props} width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 0.395996C7.57016 0.395996 0.329956 7.6362 0.329956 16.566C0.329956 24.5751 6.16105 31.2081 13.8039 32.4918V19.9419H9.90326V15.4242H13.8039V12.0912C13.8039 8.2269 16.1634 6.1215 19.6119 6.1215C21.2619 6.1215 22.6842 6.2436 23.0934 6.2997V10.3389H20.7009C18.8265 10.3389 18.4635 11.2299 18.4635 12.5367V15.4209H22.9383L22.3542 19.9386H18.4668V32.604C26.466 31.6305 32.67 24.8259 32.67 16.5627C32.67 7.6362 25.4298 0.395996 16.5 0.395996Z" fill="#F7D21E"/>
        </svg>
        

    )
}
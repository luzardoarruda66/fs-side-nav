
import * as React from 'react';


interface ClockIconProps extends React.SVGAttributes<HTMLOrSVGElement> { }

export function ClockIcon(props: ClockIconProps): JSX.Element {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9997 0.333374C5.58301 0.333374 0.333008 5.58337 0.333008 12C0.333008 18.4167 5.58301 23.6667 11.9997 23.6667C18.4163 23.6667 23.6663 18.4167 23.6663 12C23.6663 5.58337 18.4163 0.333374 11.9997 0.333374ZM16.8997 16.9L10.833 13.1667V6.16671H12.583V12.2334L17.833 15.3834L16.8997 16.9Z" fill="#1B7754" />
        </svg>
    )
}


import * as React from 'react';

interface CancelIconProps extends React.SVGAttributes<HTMLOrSVGElement> { }

export function CancelIcon(props: CancelIconProps): JSX.Element {
  return (
    <svg {...props} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8332 1.34163L10.6582 0.166626L5.99984 4.82496L1.3415 0.166626L0.166504 1.34163L4.82484 5.99996L0.166504 10.6583L1.3415 11.8333L5.99984 7.17496L10.6582 11.8333L11.8332 10.6583L7.17484 5.99996L11.8332 1.34163Z" fill="#14181F" />
    </svg>
  )
}

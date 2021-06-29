// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245#issuecomment-780019806
import { CSSProp } from 'styled-components';
import 'styled-components/cssprop';

declare module 'react' {
  interface DOMAttributes<T> {
    css?: CSSProp;
  }
}

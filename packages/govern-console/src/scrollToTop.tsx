import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // TODO: Sarkawt When you change views(This gets called when pathname changes in the url,)
  // it should be working but it doesn't.
  useEffect(() => {
    // WAY 1
    // This doesn't work, but below WAY 2 works for changing views, it scrolls up.
    // but the Way 2 even though works with this case, it doesn't work in another situation in create dao multi steps where
    // pathname doesn't change, but we still have to scroll up after changing steps.
    window.scrollTo(0, 0);
    // WAY 2
    // const root = document.querySelector('body');
    // root?.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth',
    // });
  }, [pathname]);

  return null;
}

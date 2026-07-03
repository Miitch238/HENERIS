import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <>
      <Navbar transparentOnTop={false} />
      <div style={{ paddingTop: '60px' }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";

const CATEGORIES_BAR = [
  'Tout', 'Maroquinerie', 'Horlogerie', 'Joaillerie', 'Mode', 'Chaussures', 'Accessoires', 'Vintage', 'Collection', 'Art de vivre',
];

const CATALOGUE = {
  'maroquinerie': {
    titre: 'Maroquinerie',
    hero: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1400&q=90',
    description: 'Sacs iconiques, portefeuilles et petite maroquinerie des plus grandes maisons.',
    produits: [
      { marque: 'Hermès',         nom: 'Birkin 30 Togo',       img: 'https://images.unsplash.com/photo-1602082430164-0c1927ddecb2?w=600&q=90' },
      { marque: 'Chanel',         nom: 'Classic Flap Medium',  img: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600&q=90' },
      { marque: 'Louis Vuitton',  nom: 'Neverfull MM',         img: 'https://images.unsplash.com/photo-1624687943971-e86af76d57de?w=600&q=90' },
      { marque: 'Bottega Veneta', nom: 'Jodie Intrecciato',    img: 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=600&q=90' },
      { marque: 'Celine',         nom: 'Box Bag Noir',         img: 'https://images.unsplash.com/photo-1613482184972-f9c1022d0928?w=600&q=90' },
      { marque: 'Gucci',          nom: 'GG Marmont Matelassé', img: 'https://images.unsplash.com/photo-1637759292654-a12cb2be085e?w=600&q=90' },
      { marque: 'Dior',           nom: 'Lady Dior Medium',     img: 'https://images.unsplash.com/photo-1622560257067-108402fcedc0?w=600&q=90' },
      { marque: 'Prada',          nom: 'Saffiano Lux Tote',    img: 'https://images.unsplash.com/photo-1691480150204-66dd1eb77391?w=600&q=90' },
    ],
  },
  'horlogerie': {
    titre: 'Horlogerie',
    hero: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=1400&q=90',
    description: 'Montres de prestige, complications et pièces de collection.',
    produits: [
      { marque: 'Rolex',            nom: 'Submariner Date',     img: 'https://images.unsplash.com/photo-1730757679771-b53e798846cf?w=600&q=90' },
      { marque: 'Patek Philippe',   nom: 'Nautilus 5711',       img: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&q=90' },
      { marque: 'Audemars Piguet',  nom: 'Royal Oak 15500',     img: 'https://images.unsplash.com/photo-1548171838-1fd4cb4ab854?w=600&q=90' },
      { marque: 'Cartier',          nom: 'Santos de Cartier',   img: 'https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?w=600&q=90' },
      { marque: 'IWC',              nom: 'Portugieser Chrono',  img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=90' },
      { marque: 'Omega',            nom: 'Seamaster 300M',      img: 'https://images.unsplash.com/photo-1600003014608-c2ccc1570a65?w=600&q=90' },
      { marque: 'Jaeger-LeCoultre', nom: 'Reverso Classic',     img: 'https://images.unsplash.com/photo-1548171916-c0dea7f94ca6?w=600&q=90' },
      { marque: 'Richard Mille',    nom: 'RM 011 Felipe Massa', img: 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?w=600&q=90' },
    ],
  },
  'joaillerie': {
    titre: 'Joaillerie',
    hero: 'https://images.unsplash.com/photo-1635767798595-a1d2c9deacb4?w=1400&q=90',
    description: 'Pièces iconiques des plus grands joailliers mondiaux.',
    produits: [
      { marque: 'Cartier',       nom: 'Love Ring Or Rose',  img: 'https://images.unsplash.com/photo-1605102062083-ae61a51393f3?w=600&q=90' },
      { marque: 'Van Cleef',     nom: 'Alhambra Malachite', img: 'https://images.unsplash.com/photo-1669859097642-b8dca596fd14?w=600&q=90' },
      { marque: 'Bulgari',       nom: 'Serpenti Bracelet',  img: 'https://images.unsplash.com/photo-1762505464397-6abf1a645981?w=600&q=90' },
      { marque: 'Tiffany & Co.', nom: 'T Wire Ring',        img: 'https://images.unsplash.com/photo-1580582183555-3224a02343c8?w=600&q=90' },
      { marque: 'Chopard',       nom: 'Happy Diamonds',     img: 'https://images.unsplash.com/photo-1666287289204-3d6e636dd539?w=600&q=90' },
      { marque: 'Harry Winston', nom: 'Solitaire 2ct',      img: 'https://images.unsplash.com/photo-1769230361954-69a5bd0fcb2e?w=600&q=90' },
      { marque: 'Messika',       nom: 'Move Uno Bracelet',  img: 'https://images.unsplash.com/photo-1749841398113-39e5ec50d216?w=600&q=90' },
      { marque: 'Piaget',        nom: 'Possession Ring',    img: 'https://images.unsplash.com/photo-1635767798595-a1d2c9deacb4?w=600&q=90' },
    ],
  },
  'mode': {
    titre: 'Mode',
    hero: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1400&q=90',
    description: 'Pièces iconiques des plus grandes maisons de couture.',
    produits: [
      { marque: 'Chanel',        nom: 'Veste en tweed',     img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=90' },
      { marque: 'Saint Laurent', nom: 'Blazer Le Smoking',  img: 'https://images.unsplash.com/photo-1603484255049-ea4d0fe04fd3?w=600&q=90' },
      { marque: 'Max Mara',      nom: 'Manteau Camel',      img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=90' },
      { marque: 'Valentino',     nom: 'Robe fleurie',       img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=90' },
      { marque: 'Loro Piana',    nom: 'Pull cachemire',     img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=90' },
      { marque: 'Hermès',        nom: 'Chemise en soie',    img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=90' },
      { marque: 'Tom Ford',      nom: "Costume O'Connor",   img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=90' },
      { marque: 'Dior',          nom: 'Robe Bar',           img: 'https://images.unsplash.com/photo-1602082430164-0c1927ddecb2?w=600&q=90' },
    ],
  },
  'chaussures': {
    titre: 'Chaussures',
    hero: 'https://images.unsplash.com/photo-1571601035754-5c927f2d7edc?w=1400&q=90',
    description: 'Sneakers rares, escarpins et souliers de prestige, éditions limitées.',
    produits: [
      { marque: 'Nike',             nom: 'Air Jordan 1 Chicago',  img: 'https://images.unsplash.com/photo-1571601035754-5c927f2d7edc?w=600&q=90' },
      { marque: 'Adidas',           nom: 'Yeezy 350 V2 Beluga',   img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=90' },
      { marque: 'New Balance',      nom: '990v3 Made in USA',     img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=90' },
      { marque: 'Nike × Off-White', nom: 'Air Force 1',           img: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&q=90' },
      { marque: 'Nike',             nom: 'Dunk Low Panda',        img: 'https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?w=600&q=90' },
      { marque: 'Manolo Blahnik',   nom: 'Escarpin BB',           img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&q=90' },
      { marque: 'John Lobb',        nom: 'Derby City II',         img: 'https://images.unsplash.com/photo-1552422554-0d5af0c79fc6?w=600&q=90' },
      { marque: 'Jordan Brand',     nom: 'Air Jordan 4 Retro',    img: 'https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=600&q=90' },
    ],
  },
  'parfumerie': {
    titre: 'Parfumerie',
    hero: 'https://images.unsplash.com/photo-1644958292401-c095b23440b7?w=1400&q=90',
    description: 'Parfums de niche, eaux de parfum et collections exclusives.',
    produits: [
      { marque: 'Creed',           nom: 'Aventus EDP',       img: 'https://images.unsplash.com/photo-1718466044521-d38654f3ba0a?w=600&q=90' },
      { marque: 'Tom Ford',        nom: 'Oud Wood',          img: 'https://images.unsplash.com/photo-1624613533305-28d421d70875?w=600&q=90' },
      { marque: 'Maison Margiela', nom: 'Replica Jazz Club', img: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=90' },
      { marque: 'Chanel',          nom: 'N°5 EDP',           img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=90' },
      { marque: 'Diptyque',        nom: 'Eau Capitale',      img: 'https://images.unsplash.com/photo-1615634260830-85d92cd1b769?w=600&q=90' },
      { marque: 'Byredo',          nom: "Bal d'Afrique",     img: 'https://images.unsplash.com/photo-1673443143036-ef6eec48c595?w=600&q=90' },
      { marque: 'Acqua di Parma',  nom: 'Colonia Essenza',   img: 'https://images.unsplash.com/photo-1608721279136-cd41b752fa41?w=600&q=90' },
      { marque: 'Amouage',         nom: 'Interlude Man',     img: 'https://images.unsplash.com/photo-1644958292401-c095b23440b7?w=600&q=90' },
    ],
  },
  'vintage': {
    titre: 'Vintage',
    hero: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&q=90',
    description: "Pièces d'archive et éditions rares des décennies passées.",
    produits: [
      { marque: 'Chanel',        nom: 'Veste tweed Années 80',   img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=90' },
      { marque: 'Hermès',        nom: 'Kelly 28 Vintage',        img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=90' },
      { marque: "Levi's",        nom: '501 Années 90 Délavé',    img: 'https://images.unsplash.com/photo-1542574271-7f3b92e6c821?w=600&q=90' },
      { marque: 'Versace',       nom: 'Chemise Archive SS95',    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=90' },
      { marque: 'Rolex',         nom: 'Datejust 1601 Années 70', img: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=600&q=90' },
      { marque: 'Louis Vuitton', nom: 'Speedy 30 Monogram 80s',  img: 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=600&q=90' },
      { marque: 'Gucci',         nom: 'Mocassin Horsebit 70s',   img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=90' },
      { marque: 'Cartier',       nom: 'Must de Cartier Tank',    img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=90' },
    ],
  },
  'collection': {
    titre: 'Collection',
    hero: 'https://images.unsplash.com/photo-1769230361954-69a5bd0fcb2e?w=1400&q=90',
    description: 'Pièces rares, séries limitées et trouvailles exceptionnelles.',
    produits: [
      { marque: 'Richard Mille',  nom: 'RM 11-03 Édition limitée', img: 'https://images.unsplash.com/photo-1730757679771-b53e798846cf?w=600&q=90' },
      { marque: 'Hermès',         nom: 'Birkin Himalaya',          img: 'https://images.unsplash.com/photo-1602082430164-0c1927ddecb2?w=600&q=90' },
      { marque: 'Patek Philippe', nom: 'Grandmaster Chime',        img: 'https://images.unsplash.com/photo-1548171838-1fd4cb4ab854?w=600&q=90' },
      { marque: 'Nike',           nom: 'Air Jordan 1 Trophy Room', img: 'https://images.unsplash.com/photo-1571601035754-5c927f2d7edc?w=600&q=90' },
      { marque: 'Cartier',        nom: 'Crash Vintage 70s',        img: 'https://images.unsplash.com/photo-1605102062083-ae61a51393f3?w=600&q=90' },
      { marque: 'Chanel',         nom: '2.55 Édition limitée',     img: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600&q=90' },
      { marque: 'Baccarat',       nom: 'Pièce de cristal rare',    img: 'https://images.unsplash.com/photo-1575027773195-f6c7298430c8?w=600&q=90' },
      { marque: 'Rolex',          nom: 'Daytona Paul Newman',      img: 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?w=600&q=90' },
    ],
  },
  'art-de-vivre': {
    titre: 'Art de vivre',
    hero: 'https://images.unsplash.com/photo-1575027773195-f6c7298430c8?w=1400&q=90',
    description: "Objets d'exception pour la maison et le quotidien de luxe.",
    produits: [
      { marque: 'Hermès',        nom: 'Carré de table',          img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=90' },
      { marque: 'Christofle',    nom: 'Couverts Perles',         img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=90' },
      { marque: 'Baccarat',      nom: 'Vase Harcourt',           img: 'https://images.unsplash.com/photo-1575027773195-f6c7298430c8?w=600&q=90' },
      { marque: 'Lalique',       nom: 'Carafe Bacchantes',       img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=90' },
      { marque: 'Louis Vuitton', nom: "Plateau d'échecs",        img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=90' },
      { marque: 'Cire Trudon',   nom: 'Bougie Abd El Kader',     img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=90' },
      { marque: 'Frette',        nom: 'Parure Hotel Collection', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=90' },
      { marque: 'Bernardaud',    nom: 'Service en porcelaine',   img: 'https://images.unsplash.com/photo-1513506003901-1e6a35e5c9ed?w=600&q=90' },
    ],
  },
  'accessoires': {
    titre: 'Accessoires',
    hero: 'https://images.unsplash.com/photo-1677478863154-55ecce8c7536?w=1400&q=90',
    description: 'Lunettes, foulards, chapeaux et accessoires de mode.',
    produits: [
      { marque: 'Hermès',         nom: 'Carré Soie 90cm',    img: 'https://images.unsplash.com/photo-1677478863154-55ecce8c7536?w=600&q=90' },
      { marque: 'Linda Farrow',   nom: 'Lunettes oversized', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=90' },
      { marque: 'Maison Michel',  nom: 'Chapeau en feutre',  img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=90' },
      { marque: 'Hermès',         nom: 'Ceinture H en cuir', img: 'https://images.unsplash.com/photo-1624222247344-550fb4a5e4b7?w=600&q=90' },
      { marque: 'Brioni',         nom: 'Cravate en soie',    img: 'https://images.unsplash.com/photo-1603484255049-ea4d0fe04fd3?w=600&q=90' },
      { marque: 'Loro Piana',     nom: 'Gants Storm System', img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=90' },
      { marque: 'Celine',         nom: 'Lunettes Triomphe',  img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=90' },
      { marque: 'Bottega Veneta', nom: 'Pochette tressée',   img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=90' },
    ],
  },
  'nouveautes': {
    titre: 'Nouveautés',
    hero: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=90',
    description: 'Les dernières pièces sourcées par nos shoppers certifiés.',
    produits: [
      { marque: 'Hermès',         nom: 'Birkin 25 Ghillies',  img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=90' },
      { marque: 'Rolex',          nom: 'Daytona Panda',       img: 'https://images.unsplash.com/photo-1730757679771-b53e798846cf?w=600&q=90' },
      { marque: 'Chanel',         nom: '22 Bag',              img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=90' },
      { marque: 'Cartier',        nom: 'Panthère de Cartier', img: 'https://images.unsplash.com/photo-1635767798595-a1d2c9deacb4?w=600&q=90' },
      { marque: 'Bottega Veneta', nom: 'Sardine Bag',         img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=90' },
      { marque: 'Tom Ford',       nom: 'Oud Minerale',        img: 'https://images.unsplash.com/photo-1644958292401-c095b23440b7?w=600&q=90' },
      { marque: 'Celine',         nom: 'Arc de Triomphe',     img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e6a?w=600&q=90' },
      { marque: 'Nike × Sacai',   nom: 'LDWaffle Black',      img: 'https://images.unsplash.com/photo-1571601035754-5c927f2d7edc?w=600&q=90' },
    ],
  },
};

export default function Categorie() {
  const { categorie } = useParams();
  const [role, setRole]               = useState(null);
  const [user, setUser]               = useState(null);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navVisible, setNavVisible]   = useState(true);
  const profileRef = useRef(null);
  const lastScroll = useRef(0);
  const navigate   = useNavigate();

  const data = CATALOGUE[categorie] || CATALOGUE['nouveautes'];

  useEffect(() => {
    const getRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);
      const metaRole = session.user.user_metadata?.role;
      if (metaRole) { setRole(metaRole); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', session.user.id).single();
      if (profile?.role) setRole(profile.role);
    };
    getRole();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current <= 10) setNavVisible(true);
      else if (current > lastScroll.current + 5) setNavVisible(false);
      else if (current < lastScroll.current - 5) setNavVisible(true);
      lastScroll.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setRole(null); setProfileOpen(false);
    window.location.href = '/#/';
  };

  const handleDemande = () => {
    if (role === 'client') navigate('/deposer-demande');
    else navigate('/login');
  };

  const toSlug = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'et').replace(/ /g, '-');

  const dashLink =
    role === 'shopper' ? '/shopper/home' :
    role === 'client'  ? '/client/home'  :
    role === 'admin'   ? '/admin/dashboard' : '/login';

  const firstName = user?.user_metadata?.first_name || '';
  const lastName  = user?.user_metadata?.last_name  || '';
  const initials  = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() : null;

  const menuItems = role === 'client' ? [
    { label: 'Mon profil',   to: '/client/profil' },
    { label: 'Mes demandes', to: '/client/suivi' },
  ] : role === 'shopper' ? [
    { label: 'Mon profil', to: '/shopper/profil' },
    { label: 'Mes gains',  to: '/shopper/gains' },
  ] : [];

  const navTop  = navVisible ? '0px' : '-60px';
  const catsTop = navVisible ? '60px' : '0px';

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: sans }}>

      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 32px', height: '60px', background: '#fff', position: 'fixed', top: navTop, left: 0, right: 0, zIndex: 1000, transition: 'top .3s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button onClick={() => setMenuOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'block', width: '18px', height: '1px', background: '#1a1a1a' }} />
              <span style={{ display: 'block', width: '18px', height: '1px', background: '#1a1a1a' }} />
              <span style={{ display: 'block', width: '18px', height: '1px', background: '#1a1a1a' }} />
            </div>
            <span style={{ fontSize: '8px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#1a1a1a', fontFamily: sans }}>Menu</span>
          </button>
        </div>
        <Logo to="/" color="dark" size="md" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
          <Link to={role === 'client' ? '/deposer-demande' : '/login'}
            style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#fff', background: '#1a1a1a', padding: '9px 18px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#C9A84C'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
          >Faire une demande</Link>
          <a href="/#/messages" style={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', padding: '4px', textDecoration: 'none' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></a>
          <a href="/#/notifications" style={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', padding: '4px', textDecoration: 'none' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg></a>
          <a href="/#/favoris" style={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', padding: '4px', textDecoration: 'none' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></a>
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button onClick={() => initials ? setProfileOpen(v => !v) : window.location.href = '/#/login'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#1a1a1a' }}>
              {initials ? (
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1a1a1a', color: '#C9A84C', fontSize: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans }}>{initials}</span>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              )}
            </button>
            {profileOpen && initials && (
              <div style={{ position: 'absolute', top: '48px', right: 0, width: '240px', background: '#fff', border: '.5px solid #ececec', boxShadow: '0 8px 32px rgba(0,0,0,.08)', zIndex: 200 }}>
                <div style={{ padding: '16px 20px', borderBottom: '.5px solid #ececec' }}>
                  <p style={{ fontFamily: sans, fontSize: '12px', fontWeight: '500', color: '#1a1a1a', marginBottom: '2px' }}>{firstName} {lastName}</p>
                  <p style={{ fontFamily: sans, fontSize: '10px', color: '#aaa', fontWeight: '300' }}>{user?.email}</p>
                </div>
                <div style={{ padding: '8px 0' }}>
                  {menuItems.map(({ label, to }) => (
                    <a key={label} href={`/#${to}`} onClick={() => setProfileOpen(false)}
                      style={{ display: 'block', padding: '11px 20px', fontFamily: sans, fontSize: '12px', fontWeight: '300', color: '#1a1a1a', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{label}</a>
                  ))}
                </div>
                <div style={{ borderTop: '.5px solid #ececec', padding: '8px 0' }}>
                  <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '11px 20px', fontFamily: sans, fontSize: '12px', fontWeight: '300', color: '#888', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 299, background: 'rgba(0,0,0,.3)' }} />}
      <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 300, width: '360px', background: '#fff', transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .4s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: '60px', borderBottom: '1px solid #ececec' }}>
          <Logo to={null} color="dark" size="md" />
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <nav style={{ padding: '28px 40px', display: 'flex', flexDirection: 'column' }}>
          {[
            { label: 'Accueil', to: '/' },
            { label: 'Catalogue', to: '/catalogue' },
            { label: 'Comment ça marche', to: '/how-it-works' },
            { label: 'FAQ', to: '/faq' },
            { label: 'Contact', to: '/contact' },
            { label: role ? 'Mon espace' : 'Se connecter', to: dashLink },
          ].map(({ label, to }) => (
            <Link key={label} to={to} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: serif, fontSize: '2rem', fontWeight: 300, color: '#1a1a1a', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <nav style={{ position: 'fixed', top: catsTop, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', zIndex: 89, overflowX: 'hidden', transition: 'top .3s cubic-bezier(.4,0,.2,1)' }}>
        {CATEGORIES_BAR.map((cat) => {
          const slug = toSlug(cat);
          const isActive = slug === categorie || (cat === 'Tout' && !categorie);
          return (
            <button key={cat}
              onClick={() => cat === 'Tout' ? navigate('/catalogue') : navigate(`/catalogue/${slug}`)}
              style={{ fontFamily: sans, fontSize: '11px', fontWeight: isActive ? '400' : '300', letterSpacing: '.04em', color: isActive ? '#1a1a1a' : '#888', background: 'none', border: 'none', borderBottom: isActive ? '1.5px solid #1a1a1a' : '1.5px solid transparent', padding: '14px 18px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .2s, border-color .2s' }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.borderBottomColor = '#C9A84C'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderBottomColor = 'transparent'; } }}
            >{cat}</button>
          );
        })}
      </nav>

      <div style={{ height: '480px', overflow: 'hidden', marginTop: '110px', position: 'relative' }}>
        <img src={data.hero} alt={data.titre}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(.5)' }} />
        <div style={{ position: 'absolute', bottom: '56px', left: '56px' }}>
          <p style={{ fontSize: '9px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px', fontFamily: sans }}>Heneris · {data.titre}</p>
          <h1 style={{ fontFamily: serif, fontSize: '3rem', fontWeight: 300, fontStyle: 'italic', color: '#fff', marginBottom: '12px', lineHeight: 1.1 }}>{data.titre}</h1>
          <p style={{ fontFamily: serif, fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,.7)', fontWeight: 300, maxWidth: '480px', marginBottom: '28px' }}>{data.description}</p>
          <button onClick={handleDemande}
            style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', border: '1px solid rgba(255,255,255,.7)', background: 'transparent', padding: '12px 32px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >Faire une demande</button>
        </div>
      </div>

      <div style={{ padding: '56px 48px 80px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.24em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '8px' }}>Références disponibles</p>
            <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 300, fontStyle: 'italic', color: '#1a1a1a' }}>Pièces recherchées par nos clients</h2>
          </div>
          <Link to="/catalogue" style={{ fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', fontFamily: sans, borderBottom: '.5px solid #e0e0e0', paddingBottom: '2px' }}>
            ← Tout le catalogue
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
          {data.produits.map(({ marque, nom, img }) => (
            <div key={nom} style={{ background: '#fff' }}>
              <div style={{ height: '280px', overflow: 'hidden', background: '#f7f5f2' }}>
                <img src={img} alt={nom}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .8s cubic-bezier(.4,0,.2,1)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '14px 16px 20px', background: '#fff' }}>
                <p style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '4px', fontWeight: 400 }}>{marque}</p>
                <p style={{ fontFamily: serif, fontSize: '1rem', fontWeight: 300, color: '#1a1a1a', marginBottom: '10px' }}>{nom}</p>
                <button onClick={handleDemande}
                  style={{ fontFamily: sans, fontSize: '8px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#1a1a1a', background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderBottom: '.5px solid #1a1a1a', paddingBottom: '1px' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderBottomColor = '#C9A84C'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.borderBottomColor = '#1a1a1a'; }}
                >Faire une demande →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '0 48px 80px', background: '#1a1a1a', padding: '64px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div>
          <p style={{ fontSize: '8px', letterSpacing: '.28em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px', fontFamily: sans }}>Vous ne trouvez pas ?</p>
          <h2 style={{ fontFamily: serif, fontSize: '1.8rem', fontWeight: 300, fontStyle: 'italic', color: '#fff', marginBottom: '12px', lineHeight: 1.3 }}>
            La pièce que vous cherchez<br />n'est pas listée ici ?
          </h2>
          <p style={{ fontFamily: serif, fontSize: '1rem', fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,.6)', lineHeight: 1.8, maxWidth: '420px' }}>
            Nos shoppers peuvent sourcer n'importe quelle pièce de luxe dans le monde entier.
          </p>
        </div>
        <Link to={role === 'client' ? '/deposer-demande' : '/login'}
          style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#1a1a1a', background: '#fff', padding: '14px 40px', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1a1a1a'; }}
        >Faire une demande</Link>
      </div>

      <Footer />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { isMobile, isAndroid, isIOS } from 'react-device-detect';

interface SmartBannerProps {
  title: string;
  author?: string;
  price?: string;
  iconApple?: string;
  iconGoogle?: string;
  buttonUrlApple?: string;
  buttonUrlGoogle?: string;
  closeText?: string;
  hideTtl?: number;
  hidePath?: string;
}

const SmartBanner: React.FC<SmartBannerProps> = ({
  title,
  author,
  price = 'FREE',
  iconApple,
  iconGoogle,
  buttonUrlApple,
  buttonUrlGoogle,
  closeText = 'Close',
  hideTtl,
  hidePath,
}) => {
  const [cookies, setCookie] = useCookies(['smartbanner_exited']);
  const [showBanner, setShowBanner] = useState(false);

  // Function to get store URLs from meta tags
  const getStoreUrlsFromMetaTags = () => {
    const appleMeta = document.querySelector('meta[name="apple-itunes-app"]');
    const googleMeta = document.querySelector('meta[name="google-play-app"]');

    let appleUrl = buttonUrlApple;
    let googleUrl = buttonUrlGoogle;

    // If not provided as props, try to construct from meta tags
    if (!appleUrl && appleMeta?.getAttribute('content')) {
      const appId = appleMeta.getAttribute('content')?.replace('app-id=', '');
      if (appId) {
        appleUrl = `https://apps.apple.com/app/id${appId}`;
      }
    }

    if (!googleUrl && googleMeta?.getAttribute('content')) {
      const appId = googleMeta.getAttribute('content')?.replace('app-id=', '');
      if (appId) {
        googleUrl = `https://play.google.com/store/apps/details?id=${appId}`;
      }
    }

    return { appleUrl, googleUrl };
  };

  // Function to get icons from meta tags
  const getIconsFromMetaTags = () => {
    let appleIcon = iconApple;
    let googleIcon = iconGoogle;

    // If not provided as props, try to get from meta tags
    if (!appleIcon) {
      const appleTouchIcon = document.querySelector(
        'link[rel="apple-touch-icon"]'
      );
      if (appleTouchIcon?.getAttribute('href')) {
        appleIcon = appleTouchIcon.getAttribute('href') || undefined;
      }
    }

    if (!googleIcon) {
      const androidTouchIcon = document.querySelector(
        'link[rel="android-touch-icon"]'
      );
      if (androidTouchIcon?.getAttribute('href')) {
        googleIcon = androidTouchIcon.getAttribute('href') || undefined;
      }
    }

    return { appleIcon, googleIcon };
  };

  useEffect(() => {
    // Check if banner should be shown
    const shouldShowBanner = () => {
      // Don't show on desktop
      if (!isMobile || cookies.smartbanner_exited === '1') return false;

      // Get store URLs from meta tags if not provided as props
      const { appleUrl, googleUrl } = getStoreUrlsFromMetaTags();

      // Check if we have the required URLs for the platform
      if (isAndroid && !googleUrl) return false;
      if (isIOS && !appleUrl) return false;

      return true;
    };

    setShowBanner(shouldShowBanner());
  }, [cookies.smartbanner_exited, buttonUrlApple, buttonUrlGoogle]);

  const handleClose = () => {
    setShowBanner(false);

    // Set cookie to remember dismissal
    const cookieOptions: any = {
      path: hidePath || '/',
    };

    // Add expiration if hideTtl is provided
    if (hideTtl) {
      const expires = new Date();
      expires.setTime(expires.getTime() + hideTtl);
      cookieOptions.expires = expires;
    }

    setCookie('smartbanner_exited', '1', cookieOptions);
  };

  const handleInstall = () => {
    // Track the click (you can add analytics here)
    console.log('Smart banner install clicked');
  };

  if (!showBanner) {
    return null;
  }

  const platform = isAndroid ? 'android' : 'ios';
  const { appleIcon, googleIcon } = getIconsFromMetaTags();
  const { appleUrl, googleUrl } = getStoreUrlsFromMetaTags();

  const icon = isAndroid ? googleIcon : appleIcon;
  const buttonUrl = isAndroid ? googleUrl : appleUrl;
  const buttonLabel = isAndroid
    ? 'Get it on Google Play'
    : 'Download on the App Store';

  return (
    <div className={`smartbanner smartbanner--${platform}`}>
      <button
        className="smartbanner__exit"
        onClick={handleClose}
        title={closeText}
        aria-label={closeText}
      >
        ×
      </button>

      {icon && (
        <div
          className="smartbanner__icon"
          style={{ backgroundImage: `url(${icon})` }}
        />
      )}

      <div className="smartbanner__info">
        <div className="smartbanner__info__title">{title}</div>
        {author && <div className="smartbanner__info__author">{author}</div>}
        <div className="smartbanner__info__price">{price}</div>
      </div>

      <a
        href={buttonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="smartbanner__button"
        onClick={handleInstall}
        aria-label={buttonLabel}
      >
        <span className="smartbanner__button__label">{buttonLabel}</span>
      </a>
    </div>
  );
};

export default SmartBanner;

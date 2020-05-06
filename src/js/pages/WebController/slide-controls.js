import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class SlideControls extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showBorder: false,
    };
  }

  static propTypes = {
    socket: PropTypes.object,
    specialHandler: PropTypes.func,
    controllerPin: PropTypes.number,
    default: PropTypes.any,
  };

  sendSlide = e => {
    const activeSlide = e.currentTarget;

    const prevSlide = document.querySelector(".active-slide");
    prevSlide && prevSlide.classList.remove("active-slide");
    activeSlide.classList.add("active-slide");

    if (activeSlide.id === 'anand-slide') {
      this.props.socket.emit('data', {
        host: "sttm-web",
        type: "ceremony",
        ceremonyId: 3,
        verseId: 26106,
        pin: this.props.controllerPin,
      });
      this.props.specialHandler(3);
    } else {
      const slideText = {
        'waheguru-slide': 'vwihgurU',
        'moolmantra-slide': '<> siq nwmu krqw purKu inrBau inrvYru Akwl mUriq AjUnI sYBM gur pRswid ]',
        'blank-slide': ''
      }

      this.props.socket.emit('data', {
        host: "sttm-web",
        type: "text",
        pin: this.props.controllerPin,
        text: slideText[activeSlide.id],
        isGurmukhi: true,
        isAnnouncement: true,
      });
    }
  }

  setRef = node => (this.$wrapper = node);

  scrollListener = () => {
    if (this.mounted) {
      this.setState({ showBorder: window.scrollY >= this.$wrapper.offsetTop });
    }
  };

  componentDidMount() {
    this.mounted = true;
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  componentDidUpdate() {
    if (this.props.default === 3) {
      const activeSlide = document.querySelector("#anand-slide");
      activeSlide.classList.add("active-slide");
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('scroll', this.scrollListener, {
      passive: true,
    });
  }

  render() {
    const classNames = cx({
      'control-section': true,
      'with-border': this.state.showBorder,
    });
    return (
      <div className={classNames} id="slide-container" ref={this.setRef}>
        <div className="slide-type" id="waheguru-slide" onClick={this.sendSlide}>
          <p className="gurbani-font">vwihgurU</p>
        </div>
        <div className="slide-type" id="moolmantra-slide" onClick={this.sendSlide}>
          <p>Mool Mantra</p>
        </div>
        <div className="slide-type" id="blank-slide" onClick={this.sendSlide}>
          <p>Blank Slide</p>
        </div>
        <div className="slide-type" id="anand-slide" onClick={this.sendSlide}>
          <p>Anand Sahib</p>
        </div>
      </div>
    );
  }
}

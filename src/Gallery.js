import React from 'react'
import Lightbox from 'react-images'

class Gallery extends React.Component {
  constructor() {
    super()
    this.state = {
      currentImage: 0,
      containerWidth: 0
    }
    this.handleResize = this.handleResize.bind(this)
    this.closeLightbox = this.closeLightbox.bind(this)
    this.gotoNext = this.gotoNext.bind(this)
    this.gotoPrevious = this.gotoPrevious.bind(this)
    this.openLightbox = this.openLightbox.bind(this)
  }
  componentDidMount() {
    this.setState({ containerWidth: Math.floor(this._gallery.clientWidth - 10) })
    window.addEventListener('resize', this.handleResize)
  }
  componentDidUpdate() {
    if (Math.floor(this._gallery.clientWidth - 10) !== this.state.containerWidth) {
      this.setState({ containerWidth: Math.floor(this._gallery.clientWidth - 10) })
    }
  }
  componentWillUnmount() {
    this.unmounted = true
    window.removeEventListener('resize', this.handleResize, false)
  }
  handleResize(e) {
    if (this.unmounted) return
    this.setState({ containerWidth: Math.floor(this._gallery.clientWidth - 10) })
  }
  openLightbox(index, event) {
    if (this.unmounted) return
    event.preventDefault()
    this.setState({
      currentImage: index,
      lightboxIsOpen: true
    })
  }
  closeLightbox() {
    if (this.unmounted) return
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    })
  }
  gotoPrevious() {
    if (this.unmounted) return
    this.setState({
      currentImage: this.state.currentImage - 1,
    })
  }
  gotoNext() {
    if (this.unmounted) return
    this.setState({
      currentImage: this.state.currentImage + 1,
    })
  }
  render() {
    var rowLimit = Math.floor(this.state.containerWidth / 220) + 1
    var photoPreviewNodes = []
    var contWidth = this.state.containerWidth - (rowLimit * 4) /* 4px for margin around each image */
    contWidth = Math.floor(contWidth - 24) // add some padding to prevent layout prob
    var remainder = this.props.photos.length % rowLimit
    if (remainder) { // there are fewer than rowLimit photos in last row
      var lastRowWidth = Math.floor(this.state.containerWidth - (remainder * 4) - 2)
      var lastRowIndex = this.props.photos.length - remainder
    }
    var lightboxImages = []
    for (var i = 0; i < this.props.photos.length; i += rowLimit) {
      var rowItems = []
      // loop thru each set of rowLimit num
      // eg. if rowLimit is 3 it will  loop thru 0,1,2, then 3,4,5 to perform calculations for the particular set
      var aspectRatio = 0,
        totalAr = 0,
        commonHeight = 0
      for (var j = i; j < i + rowLimit; j++) {
        if (j == this.props.photos.length) {
          break
        }
        totalAr += this.props.photos[j].aspectRatio
      }
      if (i === lastRowIndex) {
        commonHeight = lastRowWidth / totalAr
      } else {
        commonHeight = contWidth / totalAr
      }
      if (i > this.props.photos.length - 3) {
        if (commonHeight > this.props.maxHeight) commonHeight = this.props.maxHeight
      }
      // run thru the same set of items again to give the common height
      for (var k = i; k < i + rowLimit; k++) {
        if (k == this.props.photos.length) {
          break
        }
        var src = this.props.photos[k].src

        if (this.props.disableLightbox) {
          photoPreviewNodes.push(
            <div key={k} style={style}>
              <img src={src} style={{ display: 'block', border: 0 }} height={commonHeight} width={commonHeight * this.props.photos[k].aspectRatio} alt='' />
            </div>
          )
        }
        else {
          lightboxImages.push(this.props.photos[k].lightboxImage)
          photoPreviewNodes.push(
            <div key={k} style={style}>
              <a href='#' className={k} onClick={this.openLightbox.bind(this, k) }><img src={src} style={{ display: 'block', border: 0 }} height={commonHeight} width={commonHeight * this.props.photos[k].aspectRatio} alt='' /></a>
            </div>
          )
        }
      }
    }
    return (
      this.renderGallery(photoPreviewNodes, lightboxImages)
    )
  }
  renderGallery(photoPreviewNodes, lightboxImages) {
    if (this.props.disableLightbox) {
      return (
        <div id='Gallery' className='clearfix' ref={(c) => this._gallery = c}>
          {photoPreviewNodes}
        </div>
      )
    }
    else {
      return (
        <div id='Gallery' className={'clearfix ' + this.props.className} ref={(c) => this._gallery = c}>
          {photoPreviewNodes}
          <Lightbox
            currentImage={this.state.currentImage}
            images={lightboxImages}
            isOpen={this.state.lightboxIsOpen}
            onClose={this.closeLightbox}
            onClickPrev={this.gotoPrevious}
            onClickNext={this.gotoNext}
            width={1600}
            showImageCount={this.props.lightboxShowImageCount}
            backdropClosesModal={this.props.backdropClosesModal}
            />
        </div>
      )
    }
  }
};
Gallery.displayName = 'Gallery'
Gallery.propTypes = {
  photos: function (props, propName, componentName) {
    var lightboxImageValidator = React.PropTypes.object
    if (!props.disableLightbox) {
      lightboxImageValidator = React.PropTypes.object.isRequired
    }
    return React.PropTypes.arrayOf(
      React.PropTypes.shape({
        src: React.PropTypes.string.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        aspectRatio: React.PropTypes.number.isRequired,
        lightboxImage: lightboxImageValidator
      })
    ).isRequired.apply(this, arguments)
  },
  disableLightbox: React.PropTypes.bool,
  maxHeight: React.PropTypes.number,
  className: React.PropTypes.string,
}
Gallery.defaultProps = {
  lightboxShowImageCount: false,
  backdropClosesModal: true,
  disableLightbox: false,
  maxHeight: 300,
  className: '',
}
// Gallery image style
const style = {
  display: 'block',
  margin: 2,
  backgroundColor: '#e3e3e3',
  float: 'left'
}

export default Gallery

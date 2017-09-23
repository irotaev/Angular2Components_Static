import {Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {Canvas} from './Canva';
import {Photo} from './Photo';
import {AbstractComponent} from '../abstract.component';
import {ModalComponent} from '../modal-component/modal.component';

@Component({
  selector: 'sck-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent extends AbstractComponent implements OnInit {

  public canvas: Canvas;

  private _lastInsertedPhotoIndex = 0;

  @Input() imgLocation: string;
  @Input() imgNames: Array<string>;
  @Input() buttonText: string = "Еще фотографии"
  @Input() buttonText_imgsEnd: string;
  constructor(private _elementRef: ElementRef, private vcRef: ViewContainerRef, private cfResolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit() {
    this.canvas = new Canvas(this._elementRef.nativeElement.querySelector('.wrapper').clientWidth);

    this.imgNames.slice(0, 10).forEach((name) => {
      const photo = new Photo(0, 0, name);
      this.loadImg(photo, (_photo: Photo) => {
        this.canvas.addPhoto(_photo);
      });
    });
    this._lastInsertedPhotoIndex = 9;
  }

  private loadImg(photo: Photo, callback: (photo: Photo) => void) {
    const img = new Image();
    img.onload = () => {

      photo.width = 300;
      photo.height = img.height * 300 / img.width;

      callback(photo);
    };
    img.src = window.location.origin + '/assets/' + this.imgLocation + '/' + photo.src;
  }

  public moreBtnClick(event) {
    if (this._lastInsertedPhotoIndex >= this.imgNames.length) {
      this.buttonText = this.buttonText_imgsEnd;

      return false;
    }

    this.imgNames.slice(this._lastInsertedPhotoIndex, this._lastInsertedPhotoIndex + 5).forEach((name) => {
      const photo = new Photo(0, 0, name);
      this.loadImg(photo, (_photo: Photo) => {
        this.canvas.addPhoto(_photo);
      });
    });
    this._lastInsertedPhotoIndex += 5;

    return false;
  }

  public imgClick() {
    const modalFactory = this.cfResolver.resolveComponentFactory(ModalComponent);
    // let modalComponentRef = modalFactory.create(this.vcRef.injector);
    // modalComponentRef.changeDetectorRef.detectChanges();

    var modalComponent = this.vcRef.createComponent(modalFactory, this.vcRef.length, null);
    modalComponent.instance.selfComponent = modalComponent;
  }
}

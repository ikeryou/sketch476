import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { Color } from "three";
import { Param } from "../core/param";
import { Val } from "../libs/val";
import { Func } from "../core/func";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _bg: HTMLElement

  private _tgSVG: Array<SVGElement> = []
  private _tgPath: Array<SVGPathElement> = []
  private _clipID: Array<string> = []
  private _rate: Val = new Val(0)
  private _noise: number = 0.5
  private _maxW: number = Util.hit(5) ? 50 : Util.random(5, 15)
  // private _isBig: boolean = false

  constructor(opt:any) {
    super(opt)

    this.addClass('item')

    this._bg = document.createElement('div')
    this._bg.classList.add('bg')
    this.el.appendChild(this._bg)

    let col = new Color(0xffffff)
    if(!Util.hit(3)) col = new Color(0x000000).offsetHSL(Util.random(0,1), 1, 0.5)
    Tween.set(this._bg, {
      // borderRadius: '10%',
      backgroundColor: col.getStyle(),
    })




    for(let i = 0; i < 1; i++) {
      this._clipID.push('myClipPath' + Param.instance.clipId)
      Param.instance.clipId++

      this._tgSVG[i] = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      this._tgSVG[i].classList.add('js-tgSVG')

      const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')
      this._tgSVG[i].appendChild(clip)
      clip.setAttributeNS(null, 'clipPathUnits', 'objectBoundingBox')
      clip.setAttributeNS(null, 'id', this._clipID[i])

      this._tgPath[i] = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      clip.appendChild(this._tgPath[i])

      Tween.set(this._bg, {
        clipPath: 'url(#' + this._clipID[i] + ')',
      })
      document.body.appendChild(this._tgSVG[i])
    }

    this._c = opt.id * 10
    this._c = Util.randomInt(0, 1000)


  }


  //
  private _getPathStr(): string {

    let d = ''
    for(let i = 0; i < 360; i+=10) {
      // const radius = (i % 20 == 0) ? 0.2 : 0.5
      const radius = (i % 6 == 0) ? 0.25 : 1
      const ang = i + this._c * 10 * this._noise
      const x = 0.5 + Math.sin(Util.radian(ang)) * radius
      const y = 0.5 + Math.cos(Util.radian(ang)) * radius

      if(i == 0) {
        d += 'M ' + (x) + ' ' + (y) + ' '
      } else {
        d += 'L ' + (x) + ' ' + (y) + ' '
      }
    }

    return d
  }


  protected _update():void {
    super._update()

    this._rate.val = Util.map(Math.sin(this._c * 0.05), 0, 1, -1, 1)

    let w = Util.map(Math.sin(this._c * -0.03), 10, this._maxW, -1, 1)
    let h = Util.map(Math.cos(this._c * -0.03), 10, 30, -1, 1)
    // if(this._isBig) w = Util.map(Math.sin(this._c * -0.03), 0.1, 10, -1, 1)
    Tween.set(this.el, {
      width: w + Func.val('svh', 'vw'),
      height: h + Func.val('svh', 'vw'),
    })

    this._tgPath.forEach((val) => {
      const d = this._getPathStr()
      val.setAttributeNS(null, 'd', d)
    })
  }
}
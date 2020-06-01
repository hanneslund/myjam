// https://github.com/preactjs/preact/blob/master/src/index.d.ts

type RefObj<T> = {
  current: T | null;
};

declare namespace JSX {
  type TargetedEvent<
    Target extends EventTarget = EventTarget,
    TypedEvent extends Event = Event
  > = Omit<TypedEvent, "currentTarget"> & {
    readonly currentTarget: Target;
  };

  type TargetedAnimationEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    AnimationEvent
  >;
  type TargetedClipboardEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    ClipboardEvent
  >;
  type TargetedCompositionEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    CompositionEvent
  >;
  type TargetedDragEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    DragEvent
  >;
  type TargetedFocusEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    FocusEvent
  >;
  type TargetedKeyboardEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    KeyboardEvent
  >;
  type TargetedMouseEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    MouseEvent
  >;
  type TargetedPointerEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    PointerEvent
  >;
  type TargetedTouchEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    TouchEvent
  >;
  type TargetedTransitionEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    TransitionEvent
  >;
  type TargetedUIEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    UIEvent
  >;
  type TargetedWheelEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    WheelEvent
  >;

  interface EventHandler<E extends TargetedEvent> {
    /**
     * The `this` keyword always points to the DOM element the event handler
     * was invoked on. See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers#Event_handlers_parameters_this_binding_and_the_return_value
     */
    (this: E["currentTarget"], event: E): void;
  }

  type AnimationEventHandler<Target extends EventTarget> = EventHandler<
    TargetedAnimationEvent<Target>
  >;
  type ClipboardEventHandler<Target extends EventTarget> = EventHandler<
    TargetedClipboardEvent<Target>
  >;
  type CompositionEventHandler<Target extends EventTarget> = EventHandler<
    TargetedCompositionEvent<Target>
  >;
  type DragEventHandler<Target extends EventTarget> = EventHandler<
    TargetedDragEvent<Target>
  >;
  type FocusEventHandler<Target extends EventTarget> = EventHandler<
    TargetedFocusEvent<Target>
  >;
  type GenericEventHandler<Target extends EventTarget> = EventHandler<
    TargetedEvent<Target>
  >;
  type KeyboardEventHandler<Target extends EventTarget> = EventHandler<
    TargetedKeyboardEvent<Target>
  >;
  type MouseEventHandler<Target extends EventTarget> = EventHandler<
    TargetedMouseEvent<Target>
  >;
  type PointerEventHandler<Target extends EventTarget> = EventHandler<
    TargetedPointerEvent<Target>
  >;
  type TouchEventHandler<Target extends EventTarget> = EventHandler<
    TargetedTouchEvent<Target>
  >;
  type TransitionEventHandler<Target extends EventTarget> = EventHandler<
    TargetedTransitionEvent<Target>
  >;
  type UIEventHandler<Target extends EventTarget> = EventHandler<
    TargetedUIEvent<Target>
  >;
  type WheelEventHandler<Target extends EventTarget> = EventHandler<
    TargetedWheelEvent<Target>
  >;

  interface DOMAttributes<Target extends EventTarget> {
    // children?: ;

    // Image Events
    onLoad?: GenericEventHandler<Target>;
    onError?: GenericEventHandler<Target>;

    // Clipboard Events
    onCopy?: ClipboardEventHandler<Target>;
    onCut?: ClipboardEventHandler<Target>;
    onPaste?: ClipboardEventHandler<Target>;

    // Composition Events
    onCompositionEnd?: CompositionEventHandler<Target>;
    onCompositionStart?: CompositionEventHandler<Target>;
    onCompositionUpdate?: CompositionEventHandler<Target>;

    // Details Events
    onToggle?: GenericEventHandler<Target>;

    // Focus Events
    onFocus?: FocusEventHandler<Target>;
    onBlur?: FocusEventHandler<Target>;

    // Form Events
    onChange?: GenericEventHandler<Target>;
    onInput?: GenericEventHandler<Target>;
    onSearch?: GenericEventHandler<Target>;
    onSubmit?: GenericEventHandler<Target>;
    onInvalid?: GenericEventHandler<Target>;
    onReset?: GenericEventHandler<Target>;
    onFormData?: GenericEventHandler<Target>;

    // Keyboard Events
    onKeyDown?: KeyboardEventHandler<Target>;
    onKeyPress?: KeyboardEventHandler<Target>;
    onKeyUp?: KeyboardEventHandler<Target>;

    // Media Events
    onAbort?: GenericEventHandler<Target>;
    onCanPlay?: GenericEventHandler<Target>;
    onCanPlayThrough?: GenericEventHandler<Target>;
    onDurationChange?: GenericEventHandler<Target>;
    onEmptied?: GenericEventHandler<Target>;
    onEncrypted?: GenericEventHandler<Target>;
    onEnded?: GenericEventHandler<Target>;
    onLoadedData?: GenericEventHandler<Target>;
    onLoadedMetadata?: GenericEventHandler<Target>;
    onLoadStart?: GenericEventHandler<Target>;
    onPause?: GenericEventHandler<Target>;
    onPlay?: GenericEventHandler<Target>;
    onPlaying?: GenericEventHandler<Target>;
    onProgress?: GenericEventHandler<Target>;
    onRateChange?: GenericEventHandler<Target>;
    onSeeked?: GenericEventHandler<Target>;
    onSeeking?: GenericEventHandler<Target>;
    onStalled?: GenericEventHandler<Target>;
    onSuspend?: GenericEventHandler<Target>;
    onTimeUpdate?: GenericEventHandler<Target>;
    onVolumeChange?: GenericEventHandler<Target>;
    onWaiting?: GenericEventHandler<Target>;

    // MouseEvents
    onClick?: MouseEventHandler<Target>;
    onContextMenu?: MouseEventHandler<Target>;
    onDblClick?: MouseEventHandler<Target>;
    onDrag?: DragEventHandler<Target>;
    onDragEnd?: DragEventHandler<Target>;
    onDragEnter?: DragEventHandler<Target>;
    onDragExit?: DragEventHandler<Target>;
    onDragLeave?: DragEventHandler<Target>;
    onDragOver?: DragEventHandler<Target>;
    onDragStart?: DragEventHandler<Target>;
    onDrop?: DragEventHandler<Target>;
    onMouseDown?: MouseEventHandler<Target>;
    onMouseEnter?: MouseEventHandler<Target>;
    onMouseLeave?: MouseEventHandler<Target>;
    onMouseMove?: MouseEventHandler<Target>;
    onMouseOut?: MouseEventHandler<Target>;
    onMouseOver?: MouseEventHandler<Target>;
    onMouseUp?: MouseEventHandler<Target>;

    // Selection Events
    onSelect?: GenericEventHandler<Target>;

    // Touch Events
    onTouchCancel?: TouchEventHandler<Target>;
    onTouchEnd?: TouchEventHandler<Target>;
    onTouchMove?: TouchEventHandler<Target>;
    onTouchStart?: TouchEventHandler<Target>;

    // Pointer Events
    onPointerOver?: PointerEventHandler<Target>;
    onPointerEnter?: PointerEventHandler<Target>;
    onPointerDown?: PointerEventHandler<Target>;
    onPointerMove?: PointerEventHandler<Target>;
    onPointerUp?: PointerEventHandler<Target>;
    onPointerCancel?: PointerEventHandler<Target>;
    onPointerOut?: PointerEventHandler<Target>;
    onPointerLeave?: PointerEventHandler<Target>;

    // UI Events
    onScroll?: UIEventHandler<Target>;

    // Wheel Events
    onWheel?: WheelEventHandler<Target>;

    // Animation Events
    onAnimationStart?: AnimationEventHandler<Target>;
    onAnimationEnd?: AnimationEventHandler<Target>;
    onAnimationIteration?: AnimationEventHandler<Target>;

    // Transition Events
    onTransitionEnd?: TransitionEventHandler<Target>;
  }

  interface HTMLAttributes<RefType extends EventTarget = EventTarget>
    extends DOMAttributes<RefType> {
    ref?: RefObj<RefType>;

    // Standard HTML Attributes
    accept?: string;
    acceptCharset?: string;
    accessKey?: string;
    action?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    alt?: string;
    as?: string;
    async?: boolean;
    autocomplete?: string;
    autoComplete?: string;
    autocorrect?: string;
    autoCorrect?: string;
    autofocus?: boolean;
    autoFocus?: boolean;
    autoPlay?: boolean;
    capture?: boolean;
    cellPadding?: number | string;
    cellSpacing?: number | string;
    charSet?: string;
    challenge?: string;
    checked?: boolean;
    class?: string | { [classes: string]: boolean };
    className?: string | { [classes: string]: boolean };
    cols?: number;
    colSpan?: number;
    content?: string;
    contentEditable?: boolean;
    contextMenu?: string;
    controls?: boolean;
    controlsList?: string;
    coords?: string;
    crossOrigin?: string;
    data?: string;
    dateTime?: string;
    default?: boolean;
    defer?: boolean;
    dir?: "auto" | "rtl" | "ltr";
    disabled?: boolean;
    disableRemotePlayback?: boolean;
    download?: any;
    draggable?: boolean;
    encType?: string;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    frameBorder?: number | string;
    headers?: string;
    height?: number | string;
    hidden?: boolean;
    high?: number;
    href?: string;
    hrefLang?: string;
    for?: string;
    htmlFor?: string;
    httpEquiv?: string;
    icon?: string;
    id?: string;
    inputMode?: string;
    integrity?: string;
    is?: string;
    keyParams?: string;
    keyType?: string;
    kind?: string;
    label?: string;
    lang?: string;
    list?: string;
    loading?: "eager" | "lazy";
    loop?: boolean;
    low?: number;
    manifest?: string;
    marginHeight?: number;
    marginWidth?: number;
    max?: number | string;
    maxLength?: number;
    media?: string;
    mediaGroup?: string;
    method?: string;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    muted?: boolean;
    name?: string;
    nonce?: string;
    noValidate?: boolean;
    open?: boolean;
    optimum?: number;
    pattern?: string;
    placeholder?: string;
    playsInline?: boolean;
    poster?: string;
    preload?: string;
    radioGroup?: string;
    readOnly?: boolean;
    rel?: string;
    required?: boolean;
    role?: string;
    rows?: number;
    rowSpan?: number;
    sandbox?: string;
    scope?: string;
    scoped?: boolean;
    scrolling?: string;
    seamless?: boolean;
    selected?: boolean;
    shape?: string;
    size?: number;
    sizes?: string;
    slot?: string;
    span?: number;
    spellcheck?: boolean;
    src?: string;
    srcset?: string;
    srcDoc?: string;
    srcLang?: string;
    srcSet?: string;
    start?: number;
    step?: number | string;
    style?: string | { [key: string]: string };
    summary?: string;
    tabIndex?: number;
    target?: string;
    title?: string;
    type?: string;
    useMap?: string;
    value?: string | string[] | number;
    volume?: string | number;
    width?: number | string;
    wmode?: string;
    wrap?: string;

    // RDFa Attributes
    about?: string;
    datatype?: string;
    inlist?: any;
    prefix?: string;
    property?: string;
    resource?: string;
    typeof?: string;
    vocab?: string;

    // Microdata Attributes
    itemProp?: string;
    itemScope?: boolean;
    itemType?: string;
    itemID?: string;
    itemRef?: string;
  }

  interface HTMLMarqueeElement extends HTMLElement {
    behavior?: "scroll" | "slide" | "alternate";
    bgColor?: string;
    direction?: "left" | "right" | "up" | "down";
    height?: number | string;
    hspace?: number | string;
    loop?: number | string;
    scrollAmount?: number | string;
    scrollDelay?: number | string;
    trueSpeed?: boolean;
    vspace?: number | string;
    width?: number | string;
  }

  interface IntrinsicElements {
    // HTML
    a: HTMLAttributes<HTMLAnchorElement>;
    abbr: HTMLAttributes<HTMLElement>;
    address: HTMLAttributes<HTMLElement>;
    area: HTMLAttributes<HTMLAreaElement>;
    article: HTMLAttributes<HTMLElement>;
    aside: HTMLAttributes<HTMLElement>;
    audio: HTMLAttributes<HTMLAudioElement>;
    b: HTMLAttributes<HTMLElement>;
    base: HTMLAttributes<HTMLBaseElement>;
    bdi: HTMLAttributes<HTMLElement>;
    bdo: HTMLAttributes<HTMLElement>;
    big: HTMLAttributes<HTMLElement>;
    blockquote: HTMLAttributes<HTMLQuoteElement>;
    body: HTMLAttributes<HTMLBodyElement>;
    br: HTMLAttributes<HTMLBRElement>;
    button: HTMLAttributes<HTMLButtonElement>;
    canvas: HTMLAttributes<HTMLCanvasElement>;
    caption: HTMLAttributes<HTMLTableCaptionElement>;
    cite: HTMLAttributes<HTMLElement>;
    code: HTMLAttributes<HTMLElement>;
    col: HTMLAttributes<HTMLTableColElement>;
    colgroup: HTMLAttributes<HTMLTableColElement>;
    data: HTMLAttributes<HTMLDataElement>;
    datalist: HTMLAttributes<HTMLDataListElement>;
    dd: HTMLAttributes<HTMLElement>;
    del: HTMLAttributes<HTMLModElement>;
    details: HTMLAttributes<HTMLDetailsElement>;
    dfn: HTMLAttributes<HTMLElement>;
    dialog: HTMLAttributes<HTMLDialogElement>;
    div: HTMLAttributes<HTMLDivElement>;
    dl: HTMLAttributes<HTMLDListElement>;
    dt: HTMLAttributes<HTMLElement>;
    em: HTMLAttributes<HTMLElement>;
    embed: HTMLAttributes<HTMLEmbedElement>;
    fieldset: HTMLAttributes<HTMLFieldSetElement>;
    figcaption: HTMLAttributes<HTMLElement>;
    figure: HTMLAttributes<HTMLElement>;
    footer: HTMLAttributes<HTMLElement>;
    form: HTMLAttributes<HTMLFormElement>;
    h1: HTMLAttributes<HTMLHeadingElement>;
    h2: HTMLAttributes<HTMLHeadingElement>;
    h3: HTMLAttributes<HTMLHeadingElement>;
    h4: HTMLAttributes<HTMLHeadingElement>;
    h5: HTMLAttributes<HTMLHeadingElement>;
    h6: HTMLAttributes<HTMLHeadingElement>;
    head: HTMLAttributes<HTMLHeadElement>;
    header: HTMLAttributes<HTMLElement>;
    hgroup: HTMLAttributes<HTMLElement>;
    hr: HTMLAttributes<HTMLHRElement>;
    html: HTMLAttributes<HTMLHtmlElement>;
    i: HTMLAttributes<HTMLElement>;
    iframe: HTMLAttributes<HTMLIFrameElement>;
    img: HTMLAttributes<HTMLImageElement>;
    input: HTMLAttributes<HTMLInputElement>;
    ins: HTMLAttributes<HTMLModElement>;
    kbd: HTMLAttributes<HTMLElement>;
    keygen: HTMLAttributes<HTMLUnknownElement>;
    label: HTMLAttributes<HTMLLabelElement>;
    legend: HTMLAttributes<HTMLLegendElement>;
    li: HTMLAttributes<HTMLLIElement>;
    link: HTMLAttributes<HTMLLinkElement>;
    main: HTMLAttributes<HTMLElement>;
    map: HTMLAttributes<HTMLMapElement>;
    mark: HTMLAttributes<HTMLElement>;
    marquee: HTMLAttributes<HTMLMarqueeElement>;
    menu: HTMLAttributes<HTMLMenuElement>;
    menuitem: HTMLAttributes<HTMLUnknownElement>;
    meta: HTMLAttributes<HTMLMetaElement>;
    meter: HTMLAttributes<HTMLMeterElement>;
    nav: HTMLAttributes<HTMLElement>;
    noscript: HTMLAttributes<HTMLElement>;
    object: HTMLAttributes<HTMLObjectElement>;
    ol: HTMLAttributes<HTMLOListElement>;
    optgroup: HTMLAttributes<HTMLOptGroupElement>;
    option: HTMLAttributes<HTMLOptionElement>;
    output: HTMLAttributes<HTMLOutputElement>;
    p: HTMLAttributes<HTMLParagraphElement>;
    param: HTMLAttributes<HTMLParamElement>;
    picture: HTMLAttributes<HTMLPictureElement>;
    pre: HTMLAttributes<HTMLPreElement>;
    progress: HTMLAttributes<HTMLProgressElement>;
    q: HTMLAttributes<HTMLQuoteElement>;
    rp: HTMLAttributes<HTMLElement>;
    rt: HTMLAttributes<HTMLElement>;
    ruby: HTMLAttributes<HTMLElement>;
    s: HTMLAttributes<HTMLElement>;
    samp: HTMLAttributes<HTMLElement>;
    script: HTMLAttributes<HTMLScriptElement>;
    section: HTMLAttributes<HTMLElement>;
    select: HTMLAttributes<HTMLSelectElement>;
    slot: HTMLAttributes<HTMLSlotElement>;
    small: HTMLAttributes<HTMLElement>;
    source: HTMLAttributes<HTMLSourceElement>;
    span: HTMLAttributes<HTMLSpanElement>;
    strong: HTMLAttributes<HTMLElement>;
    style: HTMLAttributes<HTMLStyleElement>;
    sub: HTMLAttributes<HTMLElement>;
    summary: HTMLAttributes<HTMLElement>;
    sup: HTMLAttributes<HTMLElement>;
    table: HTMLAttributes<HTMLTableElement>;
    tbody: HTMLAttributes<HTMLTableSectionElement>;
    td: HTMLAttributes<HTMLTableCellElement>;
    textarea: HTMLAttributes<HTMLTextAreaElement>;
    tfoot: HTMLAttributes<HTMLTableSectionElement>;
    th: HTMLAttributes<HTMLTableCellElement>;
    thead: HTMLAttributes<HTMLTableSectionElement>;
    time: HTMLAttributes<HTMLTimeElement>;
    title: HTMLAttributes<HTMLTitleElement>;
    tr: HTMLAttributes<HTMLTableRowElement>;
    track: HTMLAttributes<HTMLTrackElement>;
    u: HTMLAttributes<HTMLElement>;
    ul: HTMLAttributes<HTMLUListElement>;
    var: HTMLAttributes<HTMLElement>;
    video: HTMLAttributes<HTMLVideoElement>;
    wbr: HTMLAttributes<HTMLElement>;
  }
}

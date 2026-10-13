import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductVariant } from '../../types';
import './QuickViewModal.css';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Shield,
  Sparkles,
  Check,
  Ruler,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Maximize2,
  Layers,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  label: string;
  variantName?: string;
  colorHex?: string;
}

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    isWishlisted,
    toggleWishlist,
    formatPrice,
    setIsCartOpen,
  } = useShop();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [displayImage, setDisplayImage] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Sync state whenever quickViewProduct changes
  useEffect(() => {
    if (quickViewProduct) {
      const firstVariant = quickViewProduct.colorVariants?.[0] || null;
      setSelectedVariant(firstVariant);
      const initialImg = firstVariant?.image || quickViewProduct.image;
      setDisplayImage(initialImg);
      setActiveImageIndex(0);

      const defaultSizes =
        quickViewProduct.sizes ||
        (quickViewProduct.category === 'dresses' ? ['XS', 'S', 'M', 'L', 'XL'] : []);
      setSelectedSize(defaultSizes[1] || defaultSizes[0] || '');
      setQuantity(1);
      setIsSizeGuideOpen(false);
      setIsZoomOpen(false);
    }
  }, [quickViewProduct]);

  // Build the complete left-side multi-image list for product & variants
  const galleryItems = useMemo<GalleryItem[]>(() => {
    if (!quickViewProduct) return [];

    const items: GalleryItem[] = [];
    const seenUrls = new Set<string>();

    const addImage = (url: string, label: string, variantName?: string, colorHex?: string) => {
      if (!url || seenUrls.has(url)) return;
      seenUrls.add(url);
      items.push({
        id: `${items.length}-${label}`,
        url,
        label,
        variantName,
        colorHex,
      });
    };

    // 1. Photos specific to the currently selected variant (front, angle, back, close-up)
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      const angleLabels = ['Front View', 'Angle View', 'Back View', 'Detail Shot', 'Editorial'];
      selectedVariant.images.forEach((img, idx) => {
        const label = angleLabels[idx] || `Angle ${idx + 1}`;
        addImage(img, label, selectedVariant.name, selectedVariant.colorHex);
      });
    } else if (selectedVariant?.image) {
      addImage(selectedVariant.image, selectedVariant.name, selectedVariant.name, selectedVariant.colorHex);
    }

    // 2. Photos for all other color variants so user can see every variant on the left side
    if (quickViewProduct.colorVariants) {
      quickViewProduct.colorVariants.forEach((v) => {
        if (v.images && v.images.length > 0) {
          v.images.forEach((vImg, idx) => {
            const subLabel = idx === 0 ? `${v.name}` : `${v.name} (${idx + 1})`;
            addImage(vImg, subLabel, v.name, v.colorHex);
          });
        } else {
          addImage(v.image, v.name, v.name, v.colorHex);
        }
      });
    }

    // 3. Product master gallery & secondary shots
    if (quickViewProduct.images && quickViewProduct.images.length > 0) {
      const defaultAngleNames = ['Main Look', 'Side Angle', 'Detail Shot', 'Lifestyle', 'Back View'];
      quickViewProduct.images.forEach((img, idx) => {
        const label = defaultAngleNames[idx] || `View ${idx + 1}`;
        addImage(img, label);
      });
    }

    if (quickViewProduct.secondaryImage) {
      addImage(quickViewProduct.secondaryImage, 'Alternate Angle');
    }

    if (items.length === 0) {
      addImage(quickViewProduct.image, 'Front View');
    }

    return items;
  }, [quickViewProduct, selectedVariant]);

  // Keep active index in sync with displayImage
  useEffect(() => {
    if (displayImage && galleryItems.length > 0) {
      const idx = galleryItems.findIndex((item) => item.url === displayImage);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  }, [displayImage, galleryItems]);

  if (!quickViewProduct) return null;

  const dressSizes =
    quickViewProduct.sizes ||
    (quickViewProduct.category === 'dresses' ? ['XS', 'S', 'M', 'L', 'XL'] : []);
  const isDressOrSized = quickViewProduct.category === 'dresses' || dressSizes.length > 0;
  const wishlisted = isWishlisted(quickViewProduct.id);
  const activeColorName = selectedVariant?.name || quickViewProduct.colors?.[0] || 'Default';

  // Handler when user clicks an image thumbnail on the left
  const handleSelectThumbnail = (item: GalleryItem, index: number) => {
    setDisplayImage(item.url);
    setActiveImageIndex(index);

    // If this thumbnail belongs to a variant, synchronize variant selection
    if (item.variantName && quickViewProduct.colorVariants) {
      const matchingVariant = quickViewProduct.colorVariants.find(
        (v) => v.name === item.variantName
      );
      if (matchingVariant && matchingVariant.name !== selectedVariant?.name) {
        setSelectedVariant(matchingVariant);
      }
    }
  };

  // Previous / Next image buttons
  const handlePrevImage = () => {
    if (galleryItems.length === 0) return;
    const prevIdx = (activeImageIndex - 1 + galleryItems.length) % galleryItems.length;
    setActiveImageIndex(prevIdx);
    setDisplayImage(galleryItems[prevIdx].url);
  };

  const handleNextImage = () => {
    if (galleryItems.length === 0) return;
    const nextIdx = (activeImageIndex + 1) % galleryItems.length;
    setActiveImageIndex(nextIdx);
    setDisplayImage(galleryItems[nextIdx].url);
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, activeColorName, selectedSize, displayImage);
  };

  const handleInstantBuy = () => {
    addToCart(quickViewProduct, quantity, activeColorName, selectedSize, displayImage);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const activeItem = galleryItems[activeImageIndex] || galleryItems[0];

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity"
          onClick={() => setQuickViewProduct(null)}
        />

        {/* Modal Card */}
        <div className="relative bg-white rounded-3xl max-w-4xl lg:max-w-5xl w-full shadow-2xl overflow-hidden z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-6 max-h-[92vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-sm border border-slate-200/60"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* ============================================================== */}
            {/* LEFT SIDE: MULTIPLE IMAGES FOR PRODUCT & VARIANTS GALLERY */}
            {/* ============================================================== */}
            <div className="md:col-span-7 bg-slate-50/80 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between">
              {/* Header inside left panel */}
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>Variant Angles &amp; Views</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-700 font-bold text-[10px]">
                    {galleryItems.length} photos
                  </span>
                </div>
                {activeItem?.variantName && (
                  <span className="text-[11px] font-medium text-slate-500 truncate max-w-[180px]">
                    Style: <strong className="text-slate-800">{activeItem.variantName}</strong>
                  </span>
                )}
              </div>

              {/* Multi-Image Gallery Layout: Thumbnails on the LEFT, Main Image on the RIGHT */}
              <div className="flex flex-col sm:flex-row gap-3.5 items-stretch flex-1">
                {/* -------------------------------------------------------- */}
                {/* 1. LEFT SIDE VERTICAL THUMBNAIL LIST */}
                {/* -------------------------------------------------------- */}
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[380px] sm:max-h-[460px] pb-2 sm:pb-0 pr-1 shrink-0 order-2 sm:order-1 sm:w-20 scrollbar-thin">
                  {galleryItems.map((item, idx) => {
                    const isActive = activeImageIndex === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectThumbnail(item, idx)}
                        onMouseEnter={() => {
                          setDisplayImage(item.url);
                          setActiveImageIndex(idx);
                        }}
                        className={`group relative flex flex-col items-center p-1 rounded-xl transition-all cursor-pointer bg-white ${
                          isActive
                            ? 'ring-2 ring-sky-500 border-sky-600 shadow-md scale-102'
                            : 'border border-slate-200 hover:border-sky-300 opacity-80 hover:opacity-100'
                        }`}
                        title={`${item.label}${item.variantName ? ` - ${item.variantName}` : ''}`}
                      >
                        <div className="w-14 sm:w-16 h-16 sm:h-20 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                          <img
                            src={item.url}
                            alt={item.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        {/* Miniature color pill indicator if applicable */}
                        {item.colorHex && (
                          <span
                            className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        )}

                        {/* Thumbnail View Label */}
                        <span
                          className={`text-[9px] font-medium mt-1 leading-tight text-center truncate max-w-[60px] ${
                            isActive ? 'text-sky-700 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* -------------------------------------------------------- */}
                {/* 2. MAIN LARGE PRODUCT SHOWCASE IMAGE */}
                {/* -------------------------------------------------------- */}
                <div className="relative flex-1 bg-white rounded-2xl border border-slate-200/70 p-4 sm:p-6 flex items-center justify-center min-h-[320px] sm:min-h-[440px] overflow-hidden order-1 sm:order-2 group shadow-xs">
                  {/* Badge */}
                  {quickViewProduct.badge && (
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-600 text-white shadow-xs z-20">
                      {quickViewProduct.badge}
                    </span>
                  )}

                  {/* Image Counter Badge */}
                  <span className="absolute top-3.5 right-3.5 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-900/70 text-white backdrop-blur-xs z-20 tabular-nums">
                    {activeImageIndex + 1} / {galleryItems.length}
                  </span>

                  {/* Navigation Arrows (Prev / Next) */}
                  {galleryItems.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-sky-600 shadow-md border border-slate-200/80 transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
                        aria-label="Previous view angle"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-sky-600 shadow-md border border-slate-200/80 transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
                        aria-label="Next view angle"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Large Product Photo */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={displayImage || quickViewProduct.image}
                      alt={`${quickViewProduct.name} - ${activeItem?.label || 'View'}`}
                      referrerPolicy="no-referrer"
                      className="max-h-[340px] sm:max-h-[400px] w-full object-contain filter drop-shadow-xl transition-all duration-300 group-hover:scale-102"
                    />
                  </div>

                  {/* Zoom / Fullscreen Button */}
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-600 hover:text-sky-600 shadow-sm border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer z-20 transition-all"
                    title="Zoom in on fabric & detail"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Inspect</span>
                  </button>

                  {/* Caption tag at bottom */}
                  <div className="absolute bottom-3 left-3 bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/60 text-[11px] font-medium text-slate-700 shadow-xs z-20">
                    <span>{activeItem?.label || 'Primary View'}</span>
                    {activeItem?.variantName && (
                      <span className="text-sky-600 font-semibold ml-1.5">
                        • {activeItem.variantName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnails Navigation helper hint */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>👈 Hover or click any thumbnail on the left to inspect style &amp; angles</span>
                <span className="hidden sm:inline font-mono">
                  Photo {activeImageIndex + 1} of {galleryItems.length}
                </span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT SIDE: PRODUCT DETAILS & PURCHASE MODULE */}
            {/* ============================================================== */}
            <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="uppercase tracking-wider font-semibold text-sky-600">
                    {quickViewProduct.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                      ({quickViewProduct.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {quickViewProduct.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-2 mb-3">
                  <span className="text-xl font-bold text-slate-900 tabular-nums">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-xs text-slate-400 line-through tabular-nums">
                      {formatPrice(quickViewProduct.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {quickViewProduct.description}
                </p>

                {/* ----------------------------------------------------------------- */}
                {/* COLOR & STYLE VARIANTS SELECTOR */}
                {/* ----------------------------------------------------------------- */}
                {quickViewProduct.colorVariants && quickViewProduct.colorVariants.length > 0 ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700">
                        Color &amp; Style:{' '}
                        <span className="font-bold text-slate-900">
                          {selectedVariant?.name || activeColorName}
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {quickViewProduct.colorVariants.length} styles available
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      {quickViewProduct.colorVariants.map((variant) => {
                        const isSelected = selectedVariant?.name === variant.name;
                        return (
                          <button
                            key={variant.name}
                            type="button"
                            onClick={() => {
                              setSelectedVariant(variant);
                              setDisplayImage(variant.image);
                            }}
                            className={`group relative p-0.5 rounded-xl border-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#0284C7] ring-2 ring-sky-400/40 scale-105 shadow-xs'
                                : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                            }`}
                            title={variant.name}
                          >
                            <img
                              src={variant.image}
                              alt={variant.name}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                            />
                            {/* Mini indicator dot in corner */}
                            {variant.colorHex && (
                              <span
                                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                                style={{ backgroundColor: variant.colorHex }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : quickViewProduct.colors && quickViewProduct.colors.length > 0 ? (
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-slate-700 block mb-2">
                      Color: <span className="font-bold text-slate-900">{activeColorName}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.colors.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() =>
                            setSelectedVariant({
                              name: hex,
                              colorHex: hex,
                              image: quickViewProduct.image,
                            })
                          }
                          className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                            selectedVariant?.colorHex === hex
                              ? 'ring-2 ring-sky-500 ring-offset-1 border-white scale-110 shadow-xs'
                              : 'border-white opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* ----------------------------------------------------------------- */}
                {/* SIZES FOR DRESSES: Interactive Dress Size Selector & Size Guide */}
                {/* ----------------------------------------------------------------- */}
                {isDressOrSized && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-700">Dress Size:</span>
                        <span className="text-xs font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                          {selectedSize || 'Select size'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                        className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 underline flex items-center gap-1 cursor-pointer"
                      >
                        <Ruler className="w-3 h-3" />
                        <span>{isSizeGuideOpen ? 'Hide Guide' : 'Size Guide'}</span>
                      </button>
                    </div>

                    {/* Size buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {dressSizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`w-11 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900 ring-offset-1'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>

                    {/* Size Chart Tooltip/Drawer */}
                    {isSizeGuideOpen && (
                      <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 animate-in fade-in duration-150">
                        <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                          <span>Standard Dress Size Guide (Inches)</span>
                          <button
                            type="button"
                            onClick={() => setIsSizeGuideOpen(false)}
                            className="text-slate-400 hover:text-slate-700 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] mt-1 pt-1 border-t border-slate-200">
                          <div>
                            <span className="font-bold text-slate-800 block">Size</span>
                            <div className="text-slate-500">XS</div>
                            <div className="text-slate-500">S</div>
                            <div className="text-slate-500">M</div>
                            <div className="text-slate-500">L</div>
                            <div className="text-slate-500">XL</div>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">Bust</span>
                            <div className="text-slate-500">32-33"</div>
                            <div className="text-slate-500">34-35"</div>
                            <div className="text-slate-500">36-37"</div>
                            <div className="text-slate-500">38-40"</div>
                            <div className="text-slate-500">41-43"</div>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">Waist</span>
                            <div className="text-slate-500">24-25"</div>
                            <div className="text-slate-500">26-27"</div>
                            <div className="text-slate-500">28-30"</div>
                            <div className="text-slate-500">31-33"</div>
                            <div className="text-slate-500">34-36"</div>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">Hips</span>
                            <div className="text-slate-500">34-35"</div>
                            <div className="text-slate-500">36-37"</div>
                            <div className="text-slate-500">38-40"</div>
                            <div className="text-slate-500">41-43"</div>
                            <div className="text-slate-500">44-46"</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Details Bullet points */}
                <div className="space-y-1 mb-4">
                  {quickViewProduct.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 rounded-full px-2 py-1 bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-800 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 bg-slate-900 hover:bg-[#0284C7] text-white text-xs font-semibold rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add to Bag {isDressOrSized && selectedSize ? `(${selectedSize})` : ''}
                    </span>
                  </button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className={`p-3 rounded-full border transition-colors cursor-pointer ${
                      wishlisted
                        ? 'border-rose-200 bg-rose-50 text-rose-500'
                        : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Buy Now 1-Click */}
                <button
                  onClick={handleInstantBuy}
                  className="w-full py-2.5 px-4 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>Instant Buy &amp; Deliver</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span>30-Day Risk-Free Returns &amp; Authenticity Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* HIGH-RES INSPECTION & ZOOM MODAL */}
      {/* ============================================================== */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full h-[85vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-2 right-2 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer z-30"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center text-white mb-2">
              <h4 className="font-serif-luxury text-xl font-bold">{quickViewProduct.name}</h4>
              <p className="text-xs text-slate-300">
                {activeItem?.label} {activeItem?.variantName ? `• ${activeItem.variantName}` : ''}
              </p>
            </div>

            <div className="flex-1 w-full flex items-center justify-center overflow-hidden p-4">
              <img
                src={displayImage || quickViewProduct.image}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
              />
            </div>

            {/* Bottom thumbnail selector inside zoom view */}
            <div className="flex gap-2 mt-3 overflow-x-auto max-w-full py-2">
              {galleryItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setDisplayImage(item.url);
                    setActiveImageIndex(idx);
                  }}
                  className={`w-12 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImageIndex === idx
                      ? 'border-sky-400 scale-105 ring-2 ring-sky-400/50'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

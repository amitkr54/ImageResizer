/**
 * Image Resizer Pro - Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const logoHome = document.getElementById('logo-home');
    const dashboardView = document.getElementById('dashboard-view');
    const editorView = document.getElementById('editor-view');
    const viewTitle = document.getElementById('view-title');
    const navItems = document.querySelectorAll('.nav-item');
    const toolCards = document.querySelectorAll('.tool-card');

    // Editor UI
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const workspaceLayout = document.getElementById('workspace-layout');
    const imageGrid = document.getElementById('image-grid');

    // Controls
    const pixelControls = document.getElementById('pixel-controls');
    const kbControls = document.getElementById('kb-controls');
    const passportControls = document.getElementById('passport-controls');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const unitSelect = document.getElementById('unit-select');
    const lockAspect = document.getElementById('lock-aspect');
    const targetKb = document.getElementById('target-kb');
    const qualityRange = document.getElementById('quality-range');
    const qualityVal = document.getElementById('quality-val');
    const passportPresetSelect = document.getElementById('passport-preset');
    const formatRadios = document.getElementsByName('format');

    // New Controls for Flip/Crop
    const flipControls = document.getElementById('flip-controls');
    const cropControls = document.getElementById('crop-controls');
    const btnFlipH = document.getElementById('btn-flip-h');
    const btnFlipV = document.getElementById('btn-flip-v');
    const flipHVal = document.getElementById('flip-h-val');
    const flipVVal = document.getElementById('flip-v-val');

    // Rotate Controls
    const rotateControls = document.getElementById('rotate-controls');
    const btnRotateLeft = document.getElementById('btn-rotate-left');
    const btnRotateRight = document.getElementById('btn-rotate-right');
    const rotateVal = document.getElementById('rotate-val');

    // Advanced Tool Controls
    const watermarkControls = document.getElementById('watermark-controls');
    const watermarkText = document.getElementById('watermark-text');
    const watermarkPosition = document.getElementById('watermark-position');
    const watermarkOpacity = document.getElementById('watermark-opacity');
    const watermarkFontsize = document.getElementById('watermark-fontsize');
    const watermarkColor = document.getElementById('watermark-color');
    const watermarkColorLabel = document.getElementById('watermark-color-label');
    const metadataControls = document.getElementById('metadata-controls');
    const metadataDisplay = document.getElementById('metadata-display');
    const signatureControls = document.getElementById('signature-controls');
    const signatureCanvas = document.getElementById('signature-canvas');
    const btnClearSignature = document.getElementById('btn-clear-signature');
    const btnDownloadSignature = document.getElementById('btn-download-signature');
    const signaturePensize = document.getElementById('signature-pensize');

    // Instagram and Progress Controls
    const instagramBgControls = document.getElementById('instagram-bg-controls');
    const instagramBgColor = document.getElementById('instagram-bg-color');

    // Actions
    const processBtn = document.getElementById('process-btn');
    const resetBtn = document.getElementById('reset-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');

    // Results
    const resultsArea = document.getElementById('results-area');
    const resultsGrid = document.getElementById('results-grid');

    // Before/After Preview (Removed)
    // const beforeAfterPreview = document.getElementById('before-after-preview');

    // --- State ---
    let currentTool = 'resize-pixel';
    let images = [];
    let processedResults = [];
    let globalRatio = 1;
    let isDrawing = false;
    let signatureCtx = null;
    let isDraggingSlider = false;
    let cropper = null;
    let previousUnit = 'px';
    const multipliers = { px: 1, mm: 3.7795, cm: 37.795, in: 96 };
    let previewTimeout;

    // --- Multi-Page Detection & UI Init ---
    function initMultiPage() {
        const pageTool = document.body.dataset.tool;
        if (pageTool) {
            currentTool = pageTool;
            const toolTitle = document.body.dataset.toolTitle || "Tool";

            // If we are on a dedicated tool page
            if (dashboardView) dashboardView.classList.add('hidden');
            if (editorView) editorView.classList.remove('hidden');
            if (viewTitle) viewTitle.textContent = toolTitle;

            // Highlight active nav
            navItems.forEach(i => {
                if (i.dataset.tool === pageTool) i.classList.add('active');
                else i.classList.remove('active');
            });

            configureToolUI(pageTool);
        }
    }
    initMultiPage();

    // --- View Switching for Home Page ---
    function showHome() {
        if (window.location.pathname.includes('/tools/')) {
            window.location.href = '../index.html';
            return;
        }
        if (dashboardView) dashboardView.classList.remove('hidden');
        if (editorView) editorView.classList.add('hidden');
        if (viewTitle) viewTitle.textContent = "Home";

        document.title = "Image Resizer Pro - The Ultimate Image & PDF Suite";
        navItems.forEach(i => i.classList.remove('active'));
        resetTool();
    }

    // configureToolUI handles showing/hiding sections and pre-filling values
    function configureToolUI(id) {
        if (!pixelControls) return; // Guard for non-editor pages if any

        // Hide all specific controls first
        [pixelControls, kbControls, passportControls, flipControls, cropControls, rotateControls, watermarkControls, metadataControls, signatureControls, instagramBgControls].forEach(el => {
            if (el) el.classList.add('hidden');
        });

        if (id.startsWith('compress-')) {
            kbControls.classList.remove('hidden');
            const val = id.split('-')[1].replace('kb', '');
            if (targetKb && !isNaN(val) && val !== '') targetKb.value = val;
        } else if (id === 'merge-pdf' || id === 'compress-pdf' || id === 'image-to-pdf') {
            // Hide all image controls for PDF tools
            [pixelControls, passportControls].forEach(el => { if (el) el.classList.add('hidden') });
            if (id !== 'compress-pdf') {
                if (kbControls) kbControls.classList.add('hidden');
            } else {
                if (kbControls) kbControls.classList.remove('hidden');
            }

            // Hide Format Options (it's the 4th control section, or we can find it by class)
            const formatSection = document.querySelector('.format-toggle')?.closest('.control-section');
            if (formatSection) formatSection.classList.add('hidden');

            // Update upload text
            const uploadText = document.querySelector('.upload-content p');
            const uploadTitle = document.querySelector('.upload-content h3');
            if (id === 'merge-pdf') {
                if (uploadTitle) uploadTitle.textContent = "Merge PDF";
                if (uploadText) uploadText.textContent = "Drag PDF files here to start merging";
            } else if (id === 'compress-pdf') {
                if (uploadTitle) uploadTitle.textContent = "Compress PDF";
                if (uploadText) uploadText.textContent = "Drag PDF files here to start compressing";
            } else if (id === 'image-to-pdf') {
                if (uploadTitle) uploadTitle.textContent = "Image to PDF";
                if (uploadText) uploadText.textContent = "Drag images here to convert to PDF";
            }

            // Update Process Button Text
            const processBtn = document.getElementById('process-btn');
            if (processBtn) {
                if (id === 'merge-pdf') {
                    processBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Merge PDF';
                } else if (id === 'compress-pdf') {
                    processBtn.innerHTML = '<i class="fas fa-file-contract"></i> Compress PDF';
                } else if (id === 'image-to-pdf') {
                    processBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Convert to PDF';
                }
            }
        } else if (id === 'resize-kb' || id === 'compress-custom') {
            kbControls.classList.remove('hidden');
            // Ensure Format is visible for image tools
            const formatSection = document.querySelector('.format-toggle')?.closest('.control-section');
            if (formatSection) formatSection.classList.remove('hidden');
        } else if (id === 'passport-photo' || id.startsWith('id-')) {
            pixelControls.classList.remove('hidden');
            passportControls.classList.remove('hidden');
            if (id === 'id-2x2') { widthInput.value = 2; heightInput.value = 2; unitSelect.value = 'in'; }
            if (id === 'id-35x45') { widthInput.value = 35; heightInput.value = 45; unitSelect.value = 'mm'; }
            if (id === 'id-3x4') { widthInput.value = 3; heightInput.value = 4; unitSelect.value = 'in'; }
            if (id === 'id-4x6') { widthInput.value = 4; heightInput.value = 6; unitSelect.value = 'in'; }
        } else if (id === 'resize-cm' || id === 'pan-card' || id === 'upsc-photo' || id === 'ssc-photo') {
            pixelControls.classList.remove('hidden');
            if (unitSelect) {
                unitSelect.value = 'cm';
                previousUnit = 'cm';
            }
            if (id === 'pan-card') { widthInput.value = 3.5; heightInput.value = 2.5; }
            if (id === 'upsc-photo') { widthInput.value = 3.5; heightInput.value = 4.5; }
            if (id === 'ssc-photo') { widthInput.value = 3.5; heightInput.value = 4.5; }
            if (id === 'aadhar-merger') { widthInput.value = 8.5; heightInput.value = 5.5; unitSelect.value = 'cm'; }
            if (id === 'gds-signature') {
                if (widthInput) widthInput.value = 140;
                if (heightInput) heightInput.value = 60;
                if (targetKb) targetKb.value = 15;
            }
        } else if (id === 'linkedin-carousel') {
            pixelControls.classList.remove('hidden');
            if (unitSelect) {
                unitSelect.value = 'px';
                previousUnit = 'px';
            }
            if (widthInput) widthInput.value = 1080;
            if (heightInput) heightInput.value = 1350;
            if (lockAspect) lockAspect.checked = true;
            // PDF output is forced for carousel in the processing logic usually, but here we just set dimensions
        } else if (id === 'heic-to-jpg') {
            pixelControls.classList.add('hidden');
            const formatRadioJpg = document.getElementById('fmt-jpg');
            if (formatRadioJpg) formatRadioJpg.checked = true;
        } else if (id === 'resize-mm' || id === 'a4-size') {
            pixelControls.classList.remove('hidden');
            if (unitSelect) {
                unitSelect.value = 'mm';
                previousUnit = 'mm';
            }
            if (id === 'a4-size') { widthInput.value = 210; heightInput.value = 297; }
        } else if (id === 'resize-in') {
            pixelControls.classList.remove('hidden');
            if (unitSelect) {
                unitSelect.value = 'in';
                previousUnit = 'in';
            }
        } else if (id === 'instagram-no-crop') {
            pixelControls.classList.remove('hidden');
            widthInput.value = 1080; heightInput.value = 1080;
            if (unitSelect) {
                unitSelect.value = 'px';
                previousUnit = 'px';
            }
            if (instagramBgControls) instagramBgControls.classList.remove('hidden');
        } else if (id === 'youtube-banner') {
            pixelControls.classList.remove('hidden');
            widthInput.value = 2560; heightInput.value = 1440;
            if (unitSelect) {
                unitSelect.value = 'px';
                previousUnit = 'px';
            }
        } else if (id === 'whatsapp-dp') {
            pixelControls.classList.remove('hidden');
            widthInput.value = 500; heightInput.value = 500;
            if (unitSelect) {
                unitSelect.value = 'px';
                previousUnit = 'px';
            }
        } else if (id === 'flip-image') {
            if (flipControls) flipControls.classList.remove('hidden');
            // Reset flip state
            if (flipHVal) flipHVal.value = 1;
            if (flipVVal) flipVVal.value = 1;
            if (btnFlipH) btnFlipH.classList.remove('active');
            if (btnFlipV) btnFlipV.classList.remove('active');
        } else if (id === 'crop-image') {
            if (cropControls) cropControls.classList.remove('hidden');
        } else if (id === 'rotate-image') {
            if (rotateControls) rotateControls.classList.remove('hidden');
            // Reset rotation state
            if (rotateVal) rotateVal.value = 0;
        } else if (id === 'crop-image') {
            cropControls.classList.remove('hidden');
            // Hide format options as we'll use the cropper's output
            const formatSection = document.querySelector('.format-toggle')?.closest('.control-section');
            if (formatSection) formatSection.classList.remove('hidden');
            initCropperInstance();
        } else if (id === 'convert-image') {
            // Convert is just format selection, ensure format controls are visible
            pixelControls.classList.remove('hidden');
            const formatSection = document.querySelector('.format-toggle')?.closest('.control-section');
            if (formatSection) formatSection.classList.remove('hidden');
        } else if (id === 'watermark-image') {
            if (watermarkControls) watermarkControls.classList.remove('hidden');
            pixelControls.classList.remove('hidden'); // show dimensions too
        } else if (id === 'metadata-viewer') {
            if (metadataControls) metadataControls.classList.remove('hidden');
        } else if (id === 'signature-maker') {
            if (signatureControls) signatureControls.classList.remove('hidden');
            initSignatureCanvas();
        } else {
            pixelControls.classList.remove('hidden');
        }

        // Refresh dimensions if an image exists
        if (images.length > 0) {
            refreshDimensions();
        }
    }

    function refreshDimensions() {
        if (images.length === 0 || !widthInput || !heightInput) return;
        const firstImg = images.find(i => i.type === 'image');
        if (!firstImg) return;

        const m = (unitSelect && multipliers[unitSelect.value]) || 1;
        widthInput.value = parseFloat((firstImg.originalWidth / m).toFixed(2));
        heightInput.value = parseFloat((firstImg.originalHeight / m).toFixed(2));

        // Update previousUnit to match
        if (unitSelect) previousUnit = unitSelect.value;
    }

    // --- Search & Mobile Menu ---
    const toolSearch = document.getElementById('tool-search');
    if (toolSearch) {
        toolSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            navItems.forEach(item => {
                const text = item.querySelector('span').textContent.toLowerCase();
                const isMatch = text.includes(query);
                item.style.display = isMatch ? 'flex' : 'none';
            });
            document.querySelectorAll('.nav-separator').forEach(sep => {
                let next = sep.nextElementSibling;
                let visible = false;
                while (next && !next.classList.contains('nav-separator')) {
                    if (next.classList.contains('nav-item') && next.style.display !== 'none') visible = true;
                    next = next.nextElementSibling;
                }
                sep.style.display = visible ? 'block' : 'none';
            });
        });
    }

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-active');
        });
    }

    // --- Sidebar Accordion ---
    const separators = document.querySelectorAll('.nav-separator');
    separators.forEach(sep => {
        sep.addEventListener('click', () => {
            const groupId = sep.getAttribute('data-group');
            const group = document.getElementById(`group-${groupId}`);
            if (group) {
                const isCollapsed = group.classList.toggle('collapsed');
                sep.classList.toggle('collapsed');

                // Switch transition style for smoother closing
                group.classList.add('collapsing');
                setTimeout(() => group.classList.remove('collapsing'), 400);
            }
        });
    });

    // Expand group containing active tool
    const activeTool = document.querySelector('.nav-item.active');
    if (activeTool) {
        const group = activeTool.closest('.nav-group');
        const sep = document.querySelector(`.nav-separator[data-group="${group?.id.replace('group-', '')}"]`);
        if (group && sep) {
            group.classList.remove('collapsed');
            sep.classList.remove('collapsed');
        }
    }

    // --- File Handling ---
    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', (e) => {
            if (e.target !== fileInput) fileInput.click();
        });

        // Drag & Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => uploadZone.classList.add('highlight'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => uploadZone.classList.remove('highlight'), false);
        });

        uploadZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files) handleFiles(dt.files);
        }, false);
    }
    if (fileInput) {
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    }

    async function handleFiles(files) {
        const fileList = Array.from(files).slice(0, 10);
        if (fileList.length === 0) return;

        // Clear existing context to prevent duplicates on new drops
        images = [];
        if (imageGrid) imageGrid.innerHTML = '';
        if (resultsGrid) resultsGrid.innerHTML = '';
        if (resultsArea) resultsArea.classList.add('hidden');
        if (downloadAllBtn) downloadAllBtn.classList.add('hidden');

        if (loader) {
            loader.classList.remove('hidden');
        }
        if (loaderText) {
            loaderText.textContent = "Loading files...";
        }

        for (const file of fileList) {
            if (file.type.startsWith('image/')) {
                try {
                    const imgData = await loadImage(file);
                    images.push(imgData);
                    renderPreview(imgData);
                    // Extract metadata if metadata-viewer tool
                    if (currentTool === 'metadata-viewer') {
                        extractMetadata(imgData.img);
                    }
                } catch (err) { console.error(err); }
            } else if (file.type === 'application/pdf') {
                try {
                    const previewUrl = await getPdfPreview(file);
                    images.push({ file, type: 'pdf', name: file.name, previewUrl });
                    renderPdfStub(file, previewUrl);
                } catch (err) {
                    console.error(err);
                    images.push({ file, type: 'pdf', name: file.name });
                    renderPdfStub(file);
                }
            }
        }

        if (images.length > 0) {
            if (uploadZone) uploadZone.classList.add('hidden');
            if (workspaceLayout) workspaceLayout.classList.remove('hidden');
            const firstImg = images.find(i => i.type === 'image');
            if (firstImg) {
                globalRatio = firstImg.originalWidth / firstImg.originalHeight;
                refreshDimensions();
            }

            // Re-init cropper if we're on the crop tool
            if (currentTool === 'crop-image') {
                setTimeout(initCropperInstance, 100);
            }

            // Sync preview transforms
            setTimeout(updatePreviewTransforms, 100);
        }
        if (loader) {
            loader.classList.add('hidden');
        }
    }

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve({
                    file, img, originalWidth: img.width, originalHeight: img.height, ratio: img.width / img.height, name: file.name, type: 'image'
                });
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function renderPreview(data) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.dataset.imageIndex = images.length - 1; // Track which image this is
        card.innerHTML = `
            <div class="image-card-comparison">
                <div class="image-original-box">
                    <h4>Original</h4>
                    <div class="image-wrapper">
                        <img src="${data.img.src}">
                    </div>
                    <div class="image-info">
                        <span>${data.originalWidth}x${data.originalHeight}</span>
                        <span>${(data.file.size / 1024).toFixed(1)} KB</span>
                    </div>
                </div>
                <div class="image-processed-box">
                    <h4>Processed</h4>
                    <div class="image-wrapper image-placeholder">
                        <i class="fas fa-spinner fa-pulse" style="font-size: 2rem; color: var(--text-secondary);"></i>
                        <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">Click Process to generate</p>
                    </div>
                    <div class="image-info">
                        <span>-</span>
                    </div>
                </div>
            </div>
            <div class="image-actions" style="display: none;">
                <!-- Download button will be added here after processing -->
            </div>
        `;
        imageGrid.appendChild(card);
    }

    function renderPdfStub(file, previewUrl) {
        const card = document.createElement('div');
        card.className = 'image-card';
        if (previewUrl) {
            card.innerHTML = `<img src="${previewUrl}"><div class="img-meta"><span>PDF</span><span>${(file.size / 1024).toFixed(1)} KB</span></div>`;
        } else {
            card.innerHTML = `<div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#ef4444; background:#000;"><i class="fas fa-file-pdf" style="font-size:3rem;"></i><span style="margin-top:10px; font-size:0.75rem; text-align:center;">${file.name}</span></div>`;
        }
        imageGrid.appendChild(card);
    }

    async function getPdfPreview(file) {
        if (typeof pdfjsLib === 'undefined') return null;
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.3 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            return canvas.toDataURL();
        } catch (e) {
            console.error("PDF Preview Error:", e);
            return null;
        }
    }

    // --- Control Logic ---
    // Unit Conversion Logic
    if (unitSelect) {
        previousUnit = unitSelect.value;
        unitSelect.addEventListener('change', () => {
            const newUnit = unitSelect.value;
            const w = parseFloat(widthInput.value);
            const h = parseFloat(heightInput.value);

            if (!isNaN(w) && !isNaN(h)) {
                // Convert current value to pixels first, then to new unit
                const wPx = w * multipliers[previousUnit];
                const hPx = h * multipliers[previousUnit];

                const newW = wPx / multipliers[newUnit];
                const newH = hPx / multipliers[newUnit];

                widthInput.value = parseFloat(newW.toFixed(2));
                heightInput.value = parseFloat(newH.toFixed(2));
            }
            previousUnit = newUnit;
        });
    }

    // Aspect Ratio Logic
    function getRatio() { return globalRatio || 1; }

    if (widthInput && heightInput && lockAspect) {
        widthInput.addEventListener('input', () => {
            if (lockAspect.checked && widthInput.value) {
                heightInput.value = (parseFloat(widthInput.value) / getRatio()).toFixed(2);
            }
        });
        heightInput.addEventListener('input', () => {
            if (lockAspect.checked && heightInput.value) {
                widthInput.value = (parseFloat(heightInput.value) * getRatio()).toFixed(2);
            }
        });
    }

    if (passportPresetSelect) {
        passportPresetSelect.addEventListener('change', () => {
            const val = passportPresetSelect.value;
            if (val === '2x2inch') { widthInput.value = 2; heightInput.value = 2; unitSelect.value = 'in'; }
            else if (val === '35x45mm') { widthInput.value = 35; heightInput.value = 45; unitSelect.value = 'mm'; }
            else if (val === '3.5x4.5cm') { widthInput.value = 3.5; heightInput.value = 4.5; unitSelect.value = 'cm'; }
            // Update previousUnit after preset change to avoid wrong conversion next time
            if (unitSelect) previousUnit = unitSelect.value;
        });
    }

    function updatePreviewTransforms() {
        const fh = parseInt(flipHVal?.value) || 1;
        const fv = parseInt(flipVVal?.value) || 1;
        const deg = parseInt(rotateVal?.value) || 0;

        const grid = document.getElementById('image-grid');
        if (grid) {
            const imgs = grid.querySelectorAll('img');
            imgs.forEach(img => {
                img.style.transition = 'transform 0.3s ease';
                img.style.transform = `scale(${fh}, ${fv}) rotate(${deg}deg)`;
            });
        }

        // Update active states
        if (btnFlipH) btnFlipH.classList.toggle('active', fh === -1);
        if (btnFlipV) btnFlipV.classList.toggle('active', fv === -1);
        if (btnRotateLeft) btnRotateLeft.classList.toggle('active', deg !== 0);
        if (btnRotateRight) btnRotateRight.classList.toggle('active', deg !== 0);
    }

    // Flip Logic
    if (btnFlipH) {
        btnFlipH.addEventListener('click', () => {
            flipHVal.value = (parseInt(flipHVal.value) || 1) * -1;
            updatePreviewTransforms();
        });
    }
    if (btnFlipV) {
        btnFlipV.addEventListener('click', () => {
            flipVVal.value = (parseInt(flipVVal.value) || 1) * -1;
            updatePreviewTransforms();
        });
    }

    // Rotate Logic
    if (btnRotateLeft) {
        btnRotateLeft.addEventListener('click', () => {
            rotateVal.value = ((parseInt(rotateVal.value) || 0) - 90) % 360;
            updatePreviewTransforms();
        });
    }
    if (btnRotateRight) {
        btnRotateRight.addEventListener('click', () => {
            rotateVal.value = ((parseInt(rotateVal.value) || 0) + 90) % 360;
            updatePreviewTransforms();
        });
    }

    // Watermark Opacity/Font size display
    if (watermarkOpacity) {
        watermarkOpacity.addEventListener('input', () => {
            document.getElementById('opacity-value').textContent = watermarkOpacity.value + '%';
        });
    }
    if (watermarkFontsize) {
        watermarkFontsize.addEventListener('input', () => {
            document.getElementById('fontsize-value').textContent = watermarkFontsize.value + 'px';
        });
    }

    // Instagram background color display
    if (instagramBgColor) {
        instagramBgColor.addEventListener('input', () => {
            const color = instagramBgColor.value;
            const label = document.getElementById('bg-color-label');
            if (label) {
                label.textContent = color.toUpperCase();
            }
        });
    }

    // --- Interaction Sync & Live Preview ---
    function triggerLivePreview() {
        if (images.length === 0) return;
        clearTimeout(previewTimeout);
        previewTimeout = setTimeout(async () => {
            if (currentTool === 'resize-kb' || currentTool.startsWith('compress-') || currentTool === 'watermark-image') {
                const imgData = images.find(i => i.type === 'image');
                if (!imgData) return;

                const result = await transformImage(imgData);
                // Update results area without full loader for "live" feel
                resultsArea.classList.remove('hidden');
                resultsGrid.innerHTML = '';
                addResultToGrid(result, imgData); // Pass original data

                // Use scrollIntoView to make it visible
                // resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 300);
    }

    if (qualityRange) {
        qualityRange.addEventListener('input', () => {
            const val = qualityRange.value;
            if (qualityVal) qualityVal.textContent = val + '%';
            triggerLivePreview();
        });
    }

    if (targetKb) {
        targetKb.addEventListener('input', triggerLivePreview);
    }

    if (watermarkText) {
        watermarkText.addEventListener('input', triggerLivePreview);
    }

    [watermarkPosition, watermarkOpacity, watermarkFontsize].forEach(el => {
        if (el) el.addEventListener('change', triggerLivePreview);
        if (el && el.type === 'range') el.addEventListener('input', triggerLivePreview);
    });

    if (watermarkOpacity) {
        watermarkOpacity.addEventListener('input', () => {
            document.getElementById('opacity-value').textContent = watermarkOpacity.value + '%';
        });
    }
    if (watermarkFontsize) {
        watermarkFontsize.addEventListener('input', () => {
            document.getElementById('fontsize-value').textContent = watermarkFontsize.value + 'px';
        });
    }
    if (watermarkColor) {
        watermarkColor.addEventListener('input', () => {
            if (watermarkColorLabel) watermarkColorLabel.textContent = watermarkColor.value.toUpperCase();
            triggerLivePreview();
        });
    }

    // Comparison Logic Removed


    // Signature Canvas
    function initSignatureCanvas() {
        if (!signatureCanvas) return;
        signatureCtx = signatureCanvas.getContext('2d');
        signatureCtx.strokeStyle = '#000';
        signatureCtx.lineWidth = 3;
        signatureCtx.lineCap = 'round';

        signatureCanvas.addEventListener('mousedown', startDrawing);
        signatureCanvas.addEventListener('mousemove', draw);
        signatureCanvas.addEventListener('mouseup', stopDrawing);
        signatureCanvas.addEventListener('mouseout', stopDrawing);

        // Touch events
        signatureCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e.touches[0]); });
        signatureCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); });
        signatureCanvas.addEventListener('touchend', stopDrawing);
    }

    function startDrawing(e) {
        isDrawing = true;
        const rect = signatureCanvas.getBoundingClientRect();
        signatureCtx.beginPath();
        signatureCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = signatureCanvas.getBoundingClientRect();
        signatureCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        signatureCtx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    if (btnClearSignature) {
        btnClearSignature.addEventListener('click', () => {
            if (signatureCtx) {
                signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
            }
        });
    }

    if (btnDownloadSignature) {
        btnDownloadSignature.addEventListener('click', () => {
            if (signatureCanvas) {
                signatureCanvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'signature.png';
                    a.click();
                    URL.revokeObjectURL(url);
                }, 'image/png');
            }
        });
    }

    if (signaturePensize) {
        signaturePensize.addEventListener('input', () => {
            const size = signaturePensize.value;
            if (signatureCtx) signatureCtx.lineWidth = size;
            document.getElementById('pensize-value').textContent = size + 'px';
        });
    }

    // Metadata extraction
    function extractMetadata(img) {
        if (!metadataDisplay) return;
        // Basic metadata (dimensions, size already known)
        let html = '<div style="color: var(--text-primary);">';
        html += `<p><strong>Dimensions:</strong> ${img.width} x ${img.height} pixels</p>`;
        html += `<p><strong>Aspect Ratio:</strong> ${(img.width / img.height).toFixed(2)}:1</p>`;

        // Note: Full EXIF requires library like exif-js
        // For now, show basic info
        html += '<p style="color: var(--text-secondary); margin-top: 1rem; font-size: 0.85rem;">For full EXIF data (camera, GPS, etc.), EXIF.js library integration required.</p>';
        html += '</div>';
        metadataDisplay.innerHTML = html;
    }

    if (processBtn) {
        processBtn.addEventListener('click', async () => {
            if (images.length === 0) return;
            loader.classList.remove('hidden');
            loaderText.textContent = "Processing...";
            processedResults = [];
            resultsGrid.innerHTML = '';
            try {
                if (currentTool === 'merge-pdf') {
                    await doMergePdf();
                } else if (currentTool === 'compress-pdf') {
                    await doCompressPdf();
                } else if (currentTool === 'metadata-viewer') {
                    // Metadata is display-only, no processing
                    alert('Metadata has been displayed above. No file processing needed.');
                    return;
                } else if (currentTool === 'signature-maker') {
                    alert('Use the "Save Signature" button to download your signature.');
                    return;
                } else if (currentTool === 'image-to-pdf') {
                    await doImageToPdf();
                } else {
                    // Show progress for batch image processing
                    const totalImages = images.filter(i => i.type === 'image').length;
                    let processedCount = 0;

                    for (const imgData of images) {
                        if (imgData.type !== 'image') continue;
                        processedCount++;
                        loaderText.textContent = `Processing ${processedCount} of ${totalImages} images...`;

                        const result = await transformImage(imgData);
                        processedResults.push(result);
                        addResultToGrid(result, imgData);
                    }
                }
                // Results are now shown inline, no need for separate results section
                // resultsArea.classList.remove('hidden');
                // downloadAllBtn.classList.remove('hidden');
                // resultsArea.scrollIntoView({ behavior: 'smooth' });
            } catch (err) { alert("Error: " + err.message); } finally { loader.classList.add('hidden'); }
        });
    }

    async function doCompressPdf() {
        if (typeof PDFLib === 'undefined') {
            throw new Error("PDF library not loaded.");
        }
        const { PDFDocument } = PDFLib;

        for (const data of images) {
            if (data.type !== 'pdf') continue;

            // Load the existing PDF
            const pdfBytes = await data.file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);

            // Re-saving with useObjectStreams: false sometimes creates larger files, 
            // but we try to optimize by creating a fresh doc and copying pages (strips metadata)
            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach(page => newPdf.addPage(page));

            // "Optimization" is limited in browser without advanced codecs, 
            // but this structure cleanup can help with some bloated PDFs.
            loaderText.textContent = `Optimizing PDF structure... Target: ${targetKb?.value || 'Auto'} KB`;
            // Browser-based PDF compression is limited, but re-saving strips unnecessary bloat.
            const bytes = await newPdf.save({
                useObjectStreams: true,
                addDefaultPage: false
            });

            const blob = new Blob([bytes], { type: 'application/pdf' });
            const previewUrl = await getPdfPreview(new File([blob], data.name, { type: 'application/pdf' }));
            const result = {
                blob,
                url: URL.createObjectURL(blob),
                name: 'compressed_' + data.name,
                originalSize: data.file.size,
                previewUrl
            };
            processedResults.push(result);
            addResultToGrid(result, data);
        }
    }

    function initCropperInstance() {
        if (currentTool !== 'crop-image' || images.length === 0) return;

        const firstImgData = images[0];
        if (firstImgData.type !== 'image') return;

        // Find the preview element for the first image
        const grid = document.getElementById('image-grid');
        if (!grid) return;

        const firstImageEl = grid.querySelector('img');
        if (!firstImageEl) return;

        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(firstImageEl, {
            viewMode: 1,
            autoCropArea: 0.8,
            responsive: true,
            checkOrientation: false,
            ready() {
                // Adjust container size if needed
            }
        });
    }

    // Crop Aspect Ratio buttons in UI (if they exist)
    document.querySelectorAll('[data-aspect-ratio]').forEach(btn => {
        btn.addEventListener('click', () => {
            const ratio = parseFloat(btn.dataset.aspectRatio);
            if (cropper) {
                cropper.setAspectRatio(isNaN(ratio) ? 0 : ratio);
            }
            // Highlight active button
            btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    async function transformImage(data) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let targetW = parseFloat(widthInput.value) || data.originalWidth;
        let targetH = parseFloat(heightInput.value) || data.originalHeight;

        const m = (unitSelect && multipliers[unitSelect.value]) || 1;

        // If Flip tool, use original dimensions unless explicitly overridden? 
        // Actually, for Flip, we usually just want to flip, not resize.
        if (currentTool === 'flip-image') {
            targetW = data.originalWidth;
            targetH = data.originalHeight;
        }

        // Instagram No Crop - Letterboxing
        if (currentTool === 'instagram-no-crop') {
            const targetSize = 1080;
            canvas.width = targetSize;
            canvas.height = targetSize;

            // Get background color from color picker
            const bgColor = instagramBgColor?.value || '#ffffff';
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Calculate contain dimensions (fit entire image)
            const scale = Math.min(targetSize / data.originalWidth, targetSize / data.originalHeight);
            const scaledWidth = data.originalWidth * scale;
            const scaledHeight = data.originalHeight * scale;

            // Center image
            const x = (targetSize - scaledWidth) / 2;
            const y = (targetSize - scaledHeight) / 2;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(data.img, x, y, scaledWidth, scaledHeight);

            // Skip normal drawing logic
            let format = Array.from(formatRadios).find(r => r.checked)?.value || 'image/jpeg';
            if (format === 'original') format = data.file.type;
            let blob = await new Promise(res => canvas.toBlob(res, format, 0.95));
            return {
                blob,
                url: URL.createObjectURL(blob),
                name: `instagram_${data.name.split('.')[0]}.${format.split('/')[1] || 'jpg'}`,
                originalSize: data.file.size
            };
        }

        canvas.width = Math.round(targetW * m);
        canvas.height = Math.round(targetH * m);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Apply Flip
        const fh = parseInt(flipHVal?.value) || 1;
        const fv = parseInt(flipVVal?.value) || 1;
        if (fh !== 1 || fv !== 1) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(fh, fv);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        // Apply Rotation
        const degrees = parseInt(rotateVal?.value) || 0;
        if (degrees !== 0) {
            // For 90° rotations, swap canvas dimensions
            if (Math.abs(degrees) === 90 || Math.abs(degrees) === 270) {
                const temp = canvas.width;
                canvas.width = canvas.height;
                canvas.height = temp;
            }
            const radians = (degrees * Math.PI) / 180;
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(radians);
            ctx.translate(-canvas.height / 2, -canvas.width / 2);
        }

        // Apply Crop
        if (currentTool === 'crop-image' && cropper) {
            const cropData = cropper.getData();
            const firstImg = images.find(i => i.type === 'image');

            const rx = cropData.x / firstImg.originalWidth;
            const ry = cropData.y / firstImg.originalHeight;
            const rw = cropData.width / firstImg.originalWidth;
            const rh = cropData.height / firstImg.originalHeight;

            const sx = data.originalWidth * rx;
            const sy = data.originalHeight * ry;
            const sw = data.originalWidth * rw;
            const sh = data.originalHeight * rh;

            canvas.width = Math.round(sw);
            canvas.height = Math.round(sh);

            ctx.drawImage(data.img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(data.img, 0, 0, canvas.width, canvas.height);
        }

        // Apply Watermark
        if (currentTool === 'watermark-image' && watermarkText && watermarkText.value) {
            const text = watermarkText.value;
            const position = watermarkPosition.value;
            const opacity = watermarkOpacity.value / 100;
            const fontSize = parseInt(watermarkFontsize.value);
            const color = watermarkColor?.value || '#ffffff';

            ctx.globalAlpha = opacity;
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = color;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;

            const metrics = ctx.measureText(text);
            const textWidth = metrics.width;
            const textHeight = fontSize;

            let x, y;
            const padding = 20;

            switch (position) {
                case 'top-left':
                    x = padding;
                    y = padding + textHeight;
                    break;
                case 'top-right':
                    x = canvas.width - textWidth - padding;
                    y = padding + textHeight;
                    break;
                case 'bottom-left':
                    x = padding;
                    y = canvas.height - padding;
                    break;
                case 'bottom-right':
                    x = canvas.width - textWidth - padding;
                    y = canvas.height - padding;
                    break;
                case 'center':
                    x = (canvas.width - textWidth) / 2;
                    y = canvas.height / 2;
                    break;
                default:
                    x = canvas.width - textWidth - padding;
                    y = canvas.height - padding;
            }

            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
            ctx.globalAlpha = 1;
        }

        let format = Array.from(formatRadios).find(r => r.checked)?.value || 'image/jpeg';
        if (format === 'original') format = data.file.type;

        let blob;
        if (currentTool === 'resize-kb' || currentTool.startsWith('compress-')) {
            const target = parseInt(targetKb.value) || 100;
            const result = await compressToKB(canvas, format, target);
            blob = result.blob;
        } else {
            const q = parseFloat(qualityRange?.value) / 100 || 0.9;
            blob = await new Promise(res => canvas.toBlob(res, format, q));
        }

        return {
            blob,
            url: URL.createObjectURL(blob),
            name: `pro_${data.name.split('.')[0]}.${format.split('/')[1] || 'jpg'}`,
            originalSize: data.file.size
        };
    }

    async function compressToKB(canvas, type, target) {
        let q = (parseFloat(qualityRange?.value) / 100) || 0.9;
        let blob = await new Promise(r => canvas.toBlob(r, type, q));

        if (type === 'image/jpeg' || type === 'image/webp') {
            if (target && target > 0) {
                // If already under target, try to increase quality slightly
                if (blob.size / 1024 < target * 0.9 && q < 0.95) {
                    while (blob.size / 1024 < target * 0.95 && q < 0.98) {
                        q += 0.02;
                        blob = await new Promise(r => canvas.toBlob(r, type, q));
                    }
                }
                // If over target, decrease quality
                while (blob.size / 1024 > target && q > 0.05) {
                    q -= 0.05;
                    blob = await new Promise(r => canvas.toBlob(r, type, q));
                }
            }
        }
        return {
            blob,
            quality: q
        };
    }

    async function doMergePdf() {
        if (typeof PDFLib === 'undefined') {
            throw new Error("PDF library not loaded.");
        }
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();
        for (const data of images) {
            if (data.type !== 'pdf') continue;
            const pdfBytes = await data.file.arrayBuffer();
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(p => mergedPdf.addPage(p));
        }
        const bytes = await mergedPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const totalOriginalSize = images.reduce((acc, cur) => acc + (cur.file ? cur.file.size : 0), 0);
        const previewUrl = await getPdfPreview(new File([blob], 'merged.pdf', { type: 'application/pdf' }));
        const result = {
            blob,
            url: URL.createObjectURL(blob),
            name: 'merged_pro.pdf',
            originalSize: totalOriginalSize,
            previewUrl
        };
        processedResults.push(result);
        addResultToGrid(result);
    }

    async function doImageToPdf() {
        if (typeof PDFLib === 'undefined') {
            throw new Error("PDF library not loaded.");
        }
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();

        for (const imgData of images) {
            if (imgData.type !== 'image') continue;

            // Convert image to bytes
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imgData.originalWidth;
            canvas.height = imgData.originalHeight;
            ctx.drawImage(imgData.img, 0, 0);

            // Get image data as JPEG or PNG
            const imageBlob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.95));
            const imageBytes = await imageBlob.arrayBuffer();

            // Embed image in PDF
            let embeddedImage;
            try {
                embeddedImage = await pdfDoc.embedJpg(imageBytes);
            } catch (e) {
                // If JPG fails, try PNG
                const pngBlob = await new Promise(res => canvas.toBlob(res, 'image/png'));
                const pngBytes = await pngBlob.arrayBuffer();
                embeddedImage = await pdfDoc.embedPng(pngBytes);
            }

            // Create page with image dimensions
            const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
            page.drawImage(embeddedImage, {
                x: 0,
                y: 0,
                width: embeddedImage.width,
                height: embeddedImage.height
            });
        }

        const bytes = await pdfDoc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const totalOriginalSize = images.reduce((acc, cur) => acc + (cur.file ? cur.file.size : 0), 0);
        const previewUrl = await getPdfPreview(new File([blob], 'images_converted.pdf', { type: 'application/pdf' }));
        const result = {
            blob,
            url: URL.createObjectURL(blob),
            name: 'images_converted.pdf',
            originalSize: totalOriginalSize,
            previewUrl
        };
        processedResults.push(result);
        addResultToGrid(result);
    }

    function addResultToGrid(res, originalData = null) {
        // Find the corresponding preview card
        const cardIndex = originalData ? images.indexOf(originalData) : 0;
        const previewCard = imageGrid.querySelector(`[data-image-index="${cardIndex}"]`);

        if (!previewCard) {
            console.error('Preview card not found for index:', cardIndex);
            return;
        }

        const currentSizeKB = (res.blob.size / 1024).toFixed(1);
        let reductionHtml = '';

        if (res.originalSize) {
            const originalSizeKB = (res.originalSize / 1024).toFixed(1);
            const reduction = (((res.originalSize - res.blob.size) / res.originalSize) * 100).toFixed(0);

            if (reduction > 0) {
                reductionHtml = `<span style="color: var(--success); font-size: 0.75rem;"><i class="fas fa-arrow-down"></i> ${reduction}%</span>`;
            } else if (reduction < 0) {
                reductionHtml = `<span style="color: #ef4444; font-size: 0.75rem;"><i class="fas fa-arrow-up"></i> ${Math.abs(reduction)}%</span>`;
            }
        }

        // Update the processed column
        const processedBox = previewCard.querySelector('.image-processed-box');
        if (processedBox) {
            const processedWrapper = processedBox.querySelector('.image-wrapper');
            const processedInfo = processedBox.querySelector('.image-info');

            // Update image
            if (res.previewUrl || !res.name.endsWith('.pdf')) {
                processedWrapper.innerHTML = `<img src="${res.previewUrl || res.url}">`;
            } else {
                processedWrapper.innerHTML = `<i class="fas fa-file-pdf" style="font-size: 3rem; color: #ef4444;"></i>`;
            }
            processedWrapper.classList.remove('image-placeholder');

            // Update info
            processedInfo.innerHTML = `
                <span style="color: var(--primary); font-weight: 600;">${currentSizeKB} KB</span>
                ${reductionHtml}
            `;
        }

        // Add download button
        const actionsDiv = previewCard.querySelector('.image-actions');
        if (actionsDiv) {
            actionsDiv.style.display = 'flex';
            actionsDiv.innerHTML = `
                <button class="btn-download-inline" onclick="downloadRes('${res.url}', '${res.name}')">
                    <i class="fas fa-download"></i> Download
                </button>
            `;
        }

        // Store result for download all
        processedResults.push(res);
    }

    window.downloadRes = (url, name) => {
        const a = document.createElement('a'); a.href = url; a.download = name; a.click();
    };

    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', () => processedResults.forEach(r => window.downloadRes(r.url, r.name)));
    }

    function resetTool() {
        images = []; processedResults = [];
        if (imageGrid) imageGrid.innerHTML = '';
        if (resultsGrid) resultsGrid.innerHTML = '';
        if (fileInput) fileInput.value = '';
        if (uploadZone) uploadZone.classList.remove('hidden');
        if (workspaceLayout) workspaceLayout.classList.add('hidden');
        if (resultsArea) resultsArea.classList.add('hidden');
        if (downloadAllBtn) downloadAllBtn.classList.add('hidden');
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetTool);
    }

    // Logo click listener also for sidebar logo
    if (logoHome) {
        logoHome.addEventListener('click', (e) => {
            e.preventDefault();
            showHome();
        });
    }

    // Aspect ratio locking logic
    if (widthInput && lockAspect) {
        widthInput.addEventListener('input', () => {
            if (lockAspect.checked && globalRatio) {
                heightInput.value = Math.round(widthInput.value / globalRatio);
            }
        });
        heightInput.addEventListener('input', () => {
            if (lockAspect.checked && globalRatio) {
                widthInput.value = Math.round(heightInput.value * globalRatio);
            }
        });
    }

    // Navigation Active Class removal on tool click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (sidebar) sidebar.classList.remove('mobile-active');
        });
    });

    // --- Scroll Indicator Logic ---
    const navMenu = document.querySelector('.nav-menu');
    const scrollHint = document.querySelector('.sidebar-footer');
    const hintTrigger = document.getElementById('scroll-hint');

    if (navMenu && scrollHint) {
        const updateScrollHint = () => {
            const isAtBottom = navMenu.scrollHeight - navMenu.scrollTop <= navMenu.clientHeight + 20;
            if (isAtBottom) {
                scrollHint.classList.add('hidden');
            } else {
                scrollHint.classList.remove('hidden');
            }
        };

        navMenu.addEventListener('scroll', updateScrollHint);
        window.addEventListener('resize', updateScrollHint);

        // Initial check
        setTimeout(updateScrollHint, 500);

        if (hintTrigger) {
            hintTrigger.addEventListener('click', () => {
                navMenu.scrollBy({ top: 150, behavior: 'smooth' });
            });
        }

        // Also update when categories expand/collapse
        const observer = new MutationObserver(updateScrollHint);
        observer.observe(navMenu, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    }
});

// Global Variables
let array = [];
let originalArray = [];
let currentAlgorithm = 'bubble';
let isRunning = false;
let isPaused = false;
let currentPass = 0;
let currentIndex = 0;
let stats = {
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    passes: 0,
    stepCount: 0,
    startTime: 0
};
let sortingSpeed = 1000;
let speechSynth = window.speechSynthesis;
let currentUtterance = null;
let performanceData = [];

// Algorithm Information
const algorithmInfo = {
    bubble: {
        title: "Bubble Sort Algorithm",
        description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
        timeComplexity: "Best: O(n) | Average: O(n²) | Worst: O(n²)",
        spaceComplexity: "O(1) - In-place sorting",
        stability: "Stable - Equal elements maintain relative order",
        useCase: "Small datasets or nearly sorted arrays",
        pseudocode: `// Bubble Sort Pseudocode
for i = 0 to n-2
    swapped = false
    for j = 0 to n-2-i
        if arr[j] > arr[j+1]
            swap(arr[j], arr[j+1])
            swapped = true
    if not swapped
        break`
    },
    selection: {
        title: "Selection Sort Algorithm",
        description: "Selection Sort divides the array into sorted and unsorted portions. It repeatedly finds the minimum element from the unsorted portion and places it at the beginning of the unsorted portion.",
        timeComplexity: "Best: O(n²) | Average: O(n²) | Worst: O(n²)",
        spaceComplexity: "O(1) - In-place sorting",
        stability: "Unstable - May change relative order of equal elements",
        useCase: "Small datasets where simplicity is preferred over efficiency",
        pseudocode: `// Selection Sort Pseudocode
for i = 0 to n-1
    min_index = i
    for j = i+1 to n-1
        if arr[j] < arr[min_index]
            min_index = j
    swap(arr[i], arr[min_index])`
    },
    insertion: {
        title: "Insertion Sort Algorithm",
        description: "Insertion Sort builds the final sorted array one element at a time. It takes each element from the unsorted portion and inserts it into its correct position in the sorted portion.",
        timeComplexity: "Best: O(n) | Average: O(n²) | Worst: O(n²)",
        spaceComplexity: "O(1) - In-place sorting",
        stability: "Stable - Equal elements maintain relative order",
        useCase: "Small datasets or nearly sorted arrays",
        pseudocode: `// Insertion Sort Pseudocode
for i = 1 to n-1
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key
        arr[j+1] = arr[j]
        j = j - 1
    arr[j+1] = key`
    },
    merge: {
        title: "Merge Sort Algorithm",
        description: "Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves back together.",
        timeComplexity: "Best: O(n log n) | Average: O(n log n) | Worst: O(n log n)",
        spaceComplexity: "O(n) - Requires additional space",
        stability: "Stable - Equal elements maintain relative order",
        useCase: "Large datasets where stable sorting is required",
        pseudocode: `// Merge Sort Pseudocode
function mergeSort(arr, left, right)
    if left < right
        mid = (left + right) / 2
        mergeSort(arr, left, mid)
        mergeSort(arr, mid+1, right)
        merge(arr, left, mid, right)`
    },
    quick: {
        title: "Quick Sort Algorithm",
        description: "Quick Sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it, then recursively sorts the sub-arrays.",
        timeComplexity: "Best: O(n log n) | Average: O(n log n) | Worst: O(n²)",
        spaceComplexity: "O(log n) - Recursive call stack",
        stability: "Unstable - May change relative order of equal elements",
        useCase: "General purpose sorting for large datasets",
        pseudocode: `// Quick Sort Pseudocode
function quickSort(arr, low, high)
    if low < high
        pivot = partition(arr, low, high)
        quickSort(arr, low, pivot-1)
        quickSort(arr, pivot+1, high)`
    },
    heap: {
        title: "Heap Sort Algorithm",
        description: "Heap Sort uses a binary heap data structure to sort elements. It builds a max heap from the array, then repeatedly extracts the maximum element.",
        timeComplexity: "Best: O(n log n) | Average: O(n log n) | Worst: O(n log n)",
        spaceComplexity: "O(1) - In-place sorting",
        stability: "Unstable - May change relative order of equal elements",
        useCase: "When consistent O(n log n) performance is required",
        pseudocode: `// Heap Sort Pseudocode
function heapSort(arr)
    buildMaxHeap(arr)
    for i = n-1 down to 1
        swap(arr[0], arr[i])
        heapify(arr, 0, i)`
    }
};

// DOM Elements
const elements = {
    arrayInput: document.getElementById('arrayInput'),
    generateBtn: document.getElementById('generateBtn'),
    randomBtn: document.getElementById('randomBtn'),
    sortBtn: document.getElementById('sortBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resetBtn: document.getElementById('resetBtn'),
    stepBtn: document.getElementById('stepBtn'),
    speedRange: document.getElementById('speedRange'),
    speedValue: document.getElementById('speedValue'),
    audioToggle: document.getElementById('audioToggle'),
    testAudioBtn: document.getElementById('testAudioBtn'),
    arraySizeRange: document.getElementById('arraySizeRange'),
    arraySizeValue: document.getElementById('arraySizeValue'),
    arrayContainer: document.getElementById('arrayContainer'),
    stepInfo: document.getElementById('stepInfo'),
    algorithmInfo: document.getElementById('algorithmInfo'),
    currentAlgorithmTitle: document.getElementById('currentAlgorithmTitle'),
    currentAlgorithmDescription: document.getElementById('currentAlgorithmDescription'),
    timeComplexity: document.getElementById('timeComplexity'),
    spaceComplexity: document.getElementById('spaceComplexity'),
    stability: document.getElementById('stability'),
    useCase: document.getElementById('useCase'),
    pseudocode: document.getElementById('pseudocode'),
    performanceSection: document.getElementById('performanceSection'),
    performanceTableBody: document.getElementById('performanceTableBody'),
    compareAllBtn: document.getElementById('compareAllBtn')
};

// Statistics elements
const statElements = {
    comparisons: document.getElementById('comparisons'),
    swaps: document.getElementById('swaps'),
    arrayAccesses: document.getElementById('arrayAccesses'),
    passes: document.getElementById('passes'),
    currentStep: document.getElementById('currentStep'),
    timeTaken: document.getElementById('timeTaken')
};

// Initialize the application
function init() {
    setupEventListeners();
    generateArray();
    updateAlgorithmInfo();
    loadVoices();
}

// Setup Event Listeners
function setupEventListeners() {
    // Algorithm selection
    document.querySelectorAll('.algorithm-card').forEach(card => {
        card.addEventListener('click', () => {
            selectAlgorithm(card.dataset.algorithm);
        });
        
        // Add keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectAlgorithm(card.dataset.algorithm);
            }
        });
        
        // Make focusable
        card.setAttribute('tabindex', '0');
    });
    
    // Control buttons
    elements.generateBtn.addEventListener('click', generateArray);
    elements.randomBtn.addEventListener('click', generateRandomArray);
    elements.sortBtn.addEventListener('click', startSort);
    elements.pauseBtn.addEventListener('click', pauseSort);
    elements.resetBtn.addEventListener('click', resetArray);
    elements.stepBtn.addEventListener('click', nextStep);
    elements.testAudioBtn.addEventListener('click', testAudio);
    elements.compareAllBtn.addEventListener('click', compareAllAlgorithms);
    
    // Range inputs
    elements.speedRange.addEventListener('input', updateSpeed);
    elements.arraySizeRange.addEventListener('input', updateArraySize);
    
    // Array input
    elements.arrayInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            generateArray();
        }
    });
}

// Algorithm Selection
function selectAlgorithm(algorithm) {
    if (isRunning && !isPaused) return;
    
    // Update active state
    document.querySelectorAll('.algorithm-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-algorithm="${algorithm}"]`).classList.add('active');
    
    currentAlgorithm = algorithm;
    updateAlgorithmInfo();
    resetArray();
    
    // Speak algorithm selection
    speakDetailedExplanation('algorithmSelected', { algorithm: algorithmInfo[algorithm].title });
}

// Update Algorithm Information
function updateAlgorithmInfo() {
    const info = algorithmInfo[currentAlgorithm];
    elements.currentAlgorithmTitle.textContent = info.title;
    elements.currentAlgorithmDescription.textContent = info.description;
    elements.timeComplexity.textContent = info.timeComplexity;
    elements.spaceComplexity.textContent = info.spaceComplexity;
    elements.stability.textContent = info.stability;
    elements.useCase.textContent = info.useCase;
    elements.pseudocode.textContent = info.pseudocode;
}

// Array Generation
function generateArray() {
    const input = elements.arrayInput.value;
    const numbers = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    
    if (numbers.length === 0) {
        alert('Please enter valid numbers separated by commas');
        return;
    }
    
    if (numbers.length > 50) {
        alert('Maximum 50 elements allowed');
        return;
    }
    
    array = [...numbers];
    originalArray = [...numbers];
    resetStats();
    renderArray();
    updateStepInfo('Array generated! Click "Start Sorting" to begin the sorting process.');
}

function generateRandomArray() {
    const size = parseInt(elements.arraySizeRange.value);
    const randomArray = [];
    
    for (let i = 0; i < size; i++) {
        randomArray.push(Math.floor(Math.random() * 100) + 1);
    }
    
    elements.arrayInput.value = randomArray.join(', ');
    generateArray();
}

// Array Rendering
function renderArray() {
    elements.arrayContainer.innerHTML = '';
    
    if (array.length === 0) return;
    
    const maxValue = Math.max(...array);
    const minValue = Math.min(...array);
    const range = maxValue - minValue || 1;
    
    array.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = value;
        element.id = `element-${index}`;
        
        // Calculate height based on value (minimum 40px, maximum 200px)
        const heightPercentage = (value - minValue) / range;
        const height = Math.max(40, 40 + (heightPercentage * 160));
        element.style.height = `${height}px`;
        
        // Adjust width based on array size
        if (array.length > 30) {
            element.style.minWidth = '20px';
            element.style.fontSize = '10px';
        } else if (array.length > 20) {
            element.style.minWidth = '25px';
            element.style.fontSize = '12px';
        }
        
        elements.arrayContainer.appendChild(element);
    });
}

// Statistics Management
function resetStats() {
    stats = {
        comparisons: 0,
        swaps: 0,
        arrayAccesses: 0,
        passes: 0,
        stepCount: 0,
        startTime: 0
    };
    currentPass = 0;
    currentIndex = 0;
    updateStats();
}

function updateStats() {
    statElements.comparisons.textContent = stats.comparisons;
    statElements.swaps.textContent = stats.swaps;
    statElements.arrayAccesses.textContent = stats.arrayAccesses;
    statElements.passes.textContent = stats.passes;
    statElements.currentStep.textContent = stats.stepCount;
    
    if (stats.startTime > 0) {
        const elapsed = Date.now() - stats.startTime;
        statElements.timeTaken.textContent = `${elapsed}ms`;
    }
}

// Audio System
function speakText(text, isDetailed = false) {
    if (!elements.audioToggle.checked || !text) return;
    
    stopAudio();
    
    // Clean text for better speech
    let cleanText = text.replace(/🎉|🫧|[^\w\s.,!?;:()-]/g, '').trim();
    
    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.rate = isDetailed ? 0.7 : 0.8;
    currentUtterance.pitch = 1.1;
    currentUtterance.volume = 0.9;
    
    const voices = speechSynth.getVoices();
    const preferredVoice = voices.find(voice => 
        (voice.name.includes('Google') && voice.lang.startsWith('en')) ||
        (voice.name.includes('Microsoft') && voice.lang.startsWith('en')) ||
        voice.lang.startsWith('en-US')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
        currentUtterance.voice = preferredVoice;
    }
    
    speechSynth.speak(currentUtterance);
}

function speakDetailedExplanation(type, data) {
    if (!elements.audioToggle.checked) return;
    
    let explanation = '';
    
    switch(type) {
        case 'algorithmSelected':
            explanation = `Selected ${data.algorithm}. This algorithm will be used for sorting your array.`;
            break;
        case 'start':
            explanation = `Starting ${algorithmInfo[currentAlgorithm].title} with ${data.length} elements: ${data.join(', ')}. Let's begin sorting step by step.`;
            break;
        case 'newPass':
            explanation = `Starting pass ${data.passNum} of ${currentAlgorithm} sort. ${data.description || ''}`;
            break;
        case 'compare':
            explanation = `Comparing ${data.left} and ${data.right}. ${data.reason || ''}`;
            break;
        case 'swap':
            explanation = `Swapping ${data.left} and ${data.right}. ${data.reason || 'They were in wrong order.'}`;
            break;
        case 'noSwap':
            explanation = `No swap needed between ${data.left} and ${data.right}. ${data.reason || 'They are in correct order.'}`;
            break;
        case 'passComplete':
            explanation = `Pass ${data.passNum} completed. ${data.achievement || ''}`;
            break;
        case 'complete':
            explanation = `Sorting completed! The array is now perfectly sorted. Made ${data.comparisons} comparisons and ${data.swaps} swaps.`;
            break;
        default:
            explanation = data;
    }
    
    speakText(explanation, true);
}

function stopAudio() {
    if (speechSynth.speaking) {
        speechSynth.cancel();
    }
}

function testAudio() {
    speakDetailedExplanation('start', [64, 34, 25, 12, 22, 11, 90]);
}

function loadVoices() {
    if (speechSynth.onvoiceschanged !== undefined) {
        speechSynth.onvoiceschanged = function() {
            // Voices loaded
        };
    }
}

// Element State Management
function clearElementStates() {
    document.querySelectorAll('.array-element').forEach(el => {
        el.classList.remove('comparing', 'swapping', 'sorted', 'pivot', 'current', 'minimum');
    });
}

function highlightElements(indices, className) {
    clearElementStates();
    
    if (!Array.isArray(indices)) indices = [indices];
    
    indices.forEach(index => {
        if (index >= 0 && index < array.length) {
            const element = document.getElementById(`element-${index}`);
            if (element) {
                element.classList.add(className);
            }
        }
    });
}

function markAsSorted(indices) {
    if (!Array.isArray(indices)) indices = [indices];
    
    indices.forEach(index => {
        if (index >= 0 && index < array.length) {
            const element = document.getElementById(`element-${index}`);
            if (element) {
                element.classList.add('sorted');
            }
        }
    });
}

// Step Information Update
function updateStepInfo(message, audioType = null, audioData = null) {
    elements.stepInfo.innerHTML = `
        <h3>Step ${stats.stepCount}: ${stats.passes > 0 ? `Pass ${stats.passes}` : 'Initializing'}</h3>
        <p>${message}</p>
    `;
    
    if (audioType && audioData) {
        speakDetailedExplanation(audioType, audioData);
    } else {
        speakText(message);
    }
}

// Control Functions
function updateSpeed() {
    const speed = elements.speedRange.value;
    elements.speedValue.textContent = speed;
    sortingSpeed = 2000 / speed;
}

function updateArraySize() {
    const size = elements.arraySizeRange.value;
    elements.arraySizeValue.textContent = size;
}

function toggleButtons(sorting) {
    elements.sortBtn.disabled = sorting && !isPaused;
    elements.pauseBtn.disabled = !sorting;
    elements.resetBtn.disabled = false;
    elements.stepBtn.disabled = sorting;
    elements.generateBtn.disabled = sorting && !isPaused;
    elements.randomBtn.disabled = sorting && !isPaused;
    
    if (isPaused) {
        elements.sortBtn.textContent = 'Continue';
        elements.sortBtn.disabled = false;
    } else {
        elements.sortBtn.textContent = 'Start Sorting';
    }
}

// Utility Functions
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms / elements.speedRange.value);
    });
}

function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    stats.swaps++;
    stats.arrayAccesses += 4; // 2 reads + 2 writes
}

function compare(arr, i, j) {
    stats.comparisons++;
    stats.arrayAccesses += 2; // 2 reads
    return arr[i] > arr[j];
}

function accessArray(arr, index) {
    stats.arrayAccesses++;
    return arr[index];
}

// Main Control Functions
async function startSort() {
    if (isPaused) {
        isPaused = false;
        toggleButtons(true);
        await continueSorting();
        return;
    }
    
    if (array.length === 0) {
        alert('Please generate an array first');
        return;
    }
    
    isRunning = true;
    isPaused = false;
    toggleButtons(true);
    
    array = [...originalArray];
    resetStats();
    stats.startTime = Date.now();
    renderArray();
    
    updateStepInfo('Starting sorting algorithm...', 'start', [...originalArray]);
    await sleep(sortingSpeed * 2);
    
    await executeSort();
}

function pauseSort() {
    isPaused = true;
    stopAudio();
    toggleButtons(false);
}

function resetArray() {
    isRunning = false;
    isPaused = false;
    array = [...originalArray];
    resetStats();
    renderArray();
    clearElementStates();
    toggleButtons(false);
    stopAudio();
    updateStepInfo('Array reset to original values. Ready to sort!');
}

function nextStep() {
    // Manual step-by-step would require more complex state management
    // This is a placeholder for future implementation
}

// Algorithm Execution Router
async function executeSort() {
    try {
        switch (currentAlgorithm) {
            case 'bubble':
                await bubbleSort();
                break;
            case 'selection':
                await selectionSort();
                break;
            case 'insertion':
                await insertionSort();
                break;
            case 'merge':
                await mergeSort(0, array.length - 1);
                break;
            case 'quick':
                await quickSort(0, array.length - 1);
                break;
            case 'heap':
                await heapSort();
                break;
        }
        
        if (!isPaused) {
            // Mark all as sorted
            for (let i = 0; i < array.length; i++) {
                markAsSorted(i);
            }
            
            clearElementStates();
            array.forEach((_, index) => markAsSorted(index));
            
            isRunning = false;
            toggleButtons(false);
            
            const timeTaken = Date.now() - stats.startTime;
            updateStepInfo(
                `🎉 Sorting completed! Array is now sorted in ascending order.`,
                'complete',
                { 
                    comparisons: stats.comparisons, 
                    swaps: stats.swaps,
                    timeTaken: timeTaken
                }
            );
            
            // Store performance data
            performanceData.push({
                algorithm: currentAlgorithm,
                arraySize: array.length,
                comparisons: stats.comparisons,
                swaps: stats.swaps,
                timeTaken: timeTaken
            });
            
            if (performanceData.length > 0) {
                elements.performanceSection.style.display = 'block';
                updatePerformanceTable();
            }
        }
    } catch (error) {
        console.error('Sorting error:', error);
        updateStepInfo('An error occurred during sorting. Please try again.');
        resetArray();
    }
}

// Continue sorting after pause
async function continueSorting() {
    if (isPaused) {
        await executeSort();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
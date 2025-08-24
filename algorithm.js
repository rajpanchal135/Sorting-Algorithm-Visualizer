// ===== BUBBLE SORT =====
async function bubbleSort() {
    const n = array.length;
    
    for (let pass = 0; pass < n - 1 && !isPaused; pass++) {
        stats.passes = pass + 1;
        let swappedInThisPass = false;
        
        updateStepInfo(
            `Starting pass ${pass + 1} of Bubble Sort. Comparing adjacent elements...`,
            'newPass',
            { 
                passNum: pass + 1, 
                description: `We'll bubble the largest unsorted element to its correct position.`
            }
        );
        await sleep(sortingSpeed * 2);
        
        for (let i = 0; i < n - pass - 1 && !isPaused; i++) {
            stats.stepCount++;
            updateStats();
            
            // Highlight elements being compared
            highlightElements([i, i + 1], 'comparing');
            
            updateStepInfo(
                `Comparing ${array[i]} and ${array[i + 1]}`,
                'compare',
                { 
                    left: array[i], 
                    right: array[i + 1],
                    reason: `Adjacent elements must be in ascending order.`
                }
            );
            await sleep(sortingSpeed * 2);
            
            if (compare(array, i, i + 1)) {
                // Highlight elements being swapped
                highlightElements([i, i + 1], 'swapping');
                
                const leftVal = array[i];
                const rightVal = array[i + 1];
                swap(array, i, i + 1);
                swappedInThisPass = true;
                
                updateStats();
                updateStepInfo(
                    `Swapped ${leftVal} and ${rightVal}`,
                    'swap',
                    { 
                        left: leftVal, 
                        right: rightVal,
                        reason: `${leftVal} was greater than ${rightVal}, so they needed to be swapped.`
                    }
                );
                
                await sleep(sortingSpeed * 2);
                renderArray();
                await sleep(sortingSpeed);
            } else {
                updateStepInfo(
                    `No swap needed: ${array[i]} ≤ ${array[i + 1]}`,
                    'noSwap',
                    { 
                        left: array[i], 
                        right: array[i + 1],
                        reason: `They are already in correct order.`
                    }
                );
                await sleep(sortingSpeed * 1.5);
            }
        }
        
        // Mark the last element of this pass as sorted
        markAsSorted(n - pass - 1);
        
        if (!swappedInThisPass) {
            updateStepInfo(
                `Pass ${pass + 1} completed with no swaps - array is sorted!`,
                'passComplete',
                { 
                    passNum: pass + 1,
                    achievement: `No swaps were needed, which means the array is already sorted!`
                }
            );
            await sleep(sortingSpeed * 2);
            break;
        } else {
            updateStepInfo(
                `Pass ${pass + 1} completed`,
                'passComplete',
                { 
                    passNum: pass + 1,
                    achievement: `Element ${array[n - pass - 1]} is now in its correct position.`
                }
            );
            await sleep(sortingSpeed * 2);
        }
    }
}

// ===== SELECTION SORT =====
async function selectionSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1 && !isPaused; i++) {
        stats.passes = i + 1;
        let minIndex = i;
        
        highlightElements([i], 'current');
        updateStepInfo(
            `Pass ${i + 1}: Finding minimum element from position ${i + 1} onwards`,
            'newPass',
            { 
                passNum: i + 1,
                description: `We'll find the smallest unsorted element and place it at position ${i + 1}.`
            }
        );
        await sleep(sortingSpeed * 2);
        
        // Find minimum element
        for (let j = i + 1; j < n && !isPaused; j++) {
            stats.stepCount++;
            updateStats();
            
            highlightElements([minIndex, j], 'comparing');
            
            updateStepInfo(
                `Comparing current minimum ${array[minIndex]} with ${array[j]}`,
                'compare',
                { 
                    left: array[minIndex], 
                    right: array[j],
                    reason: `Looking for the smallest element in the unsorted portion.`
                }
            );
            await sleep(sortingSpeed * 1.5);
            
            if (compare(array, minIndex, j)) {
                // Found new minimum
                minIndex = j;
                highlightElements([minIndex], 'minimum');
                
                updateStepInfo(
                    `Found new minimum: ${array[minIndex]} at position ${minIndex + 1}`,
                    null,
                    null
                );
                await sleep(sortingSpeed);
            }
        }
        
        // Swap if needed
        if (minIndex !== i) {
            highlightElements([i, minIndex], 'swapping');
            
            const currentVal = array[i];
            const minVal = array[minIndex];
            swap(array, i, minIndex);
            
            updateStats();
            updateStepInfo(
                `Swapping ${currentVal} with minimum element ${minVal}`,
                'swap',
                { 
                    left: currentVal, 
                    right: minVal,
                    reason: `Placing the minimum element in its correct sorted position.`
                }
            );
            
            await sleep(sortingSpeed * 2);
            renderArray();
        } else {
            updateStepInfo(
                `${array[i]} is already the minimum - no swap needed`,
                'noSwap',
                { 
                    left: array[i], 
                    right: array[i],
                    reason: `The element is already in its correct position.`
                }
            );
            await sleep(sortingSpeed);
        }
        
        // Mark as sorted
        markAsSorted(i);
        await sleep(sortingSpeed);
    }
    
    // Mark last element as sorted
    markAsSorted(n - 1);
}

// ===== INSERTION SORT =====
async function insertionSort() {
    const n = array.length;
    
    for (let i = 1; i < n && !isPaused; i++) {
        stats.passes = i;
        const key = accessArray(array, i);
        let j = i - 1;
        
        highlightElements([i], 'current');
        updateStepInfo(
            `Pass ${i}: Inserting ${key} into sorted portion`,
            'newPass',
            { 
                passNum: i,
                description: `We'll find the correct position for ${key} in the already sorted portion.`
            }
        );
        await sleep(sortingSpeed * 2);
        
        // Move elements greater than key one position ahead
        while (j >= 0 && !isPaused) {
            stats.stepCount++;
            updateStats();
            
            highlightElements([j, j + 1], 'comparing');
            
            updateStepInfo(
                `Comparing ${array[j]} with key ${key}`,
                'compare',
                { 
                    left: array[j], 
                    right: key,
                    reason: `Checking if ${array[j]} should move right to make space for ${key}.`
                }
            );
            await sleep(sortingSpeed * 1.5);
            
            if (compare(array, j, j)) { // array[j] > key
                if (array[j] > key) {
                    // Move element right
                    highlightElements([j, j + 1], 'swapping');
                    array[j + 1] = array[j];
                    stats.arrayAccesses += 2;
                    
                    updateStepInfo(
                        `Moving ${array[j]} one position right`,
                        null,
                        null
                    );
                    
                    await sleep(sortingSpeed);
                    renderArray();
                    j--;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        
        // Insert key at correct position
        array[j + 1] = key;
        stats.arrayAccesses++;
        
        highlightElements([j + 1], 'current');
        updateStepInfo(
            `Inserted ${key} at position ${j + 2}`,
            null,
            null
        );
        
        await sleep(sortingSpeed * 1.5);
        renderArray();
        
        // Mark sorted portion
        for (let k = 0; k <= i; k++) {
            markAsSorted(k);
        }
        await sleep(sortingSpeed);
    }
}

// ===== MERGE SORT =====
async function mergeSort(left, right) {
    if (left >= right || isPaused) return;
    
    const mid = Math.floor((left + right) / 2);
    stats.passes++;
    
    updateStepInfo(
        `Dividing array: [${left + 1}-${mid + 1}] and [${mid + 2}-${right + 1}]`,
        'newPass',
        { 
            passNum: stats.passes,
            description: `Merge sort divides the array into smaller pieces before merging them back.`
        }
    );
    await sleep(sortingSpeed * 1.5);
    
    // Recursively sort both halves
    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    
    // Merge the sorted halves
    await merge(left, mid, right);
}

async function merge(left, mid, right) {
    if (isPaused) return;
    
    const leftArr = [];
    const rightArr = [];
    
    // Copy data to temporary arrays
    for (let i = left; i <= mid; i++) {
        leftArr.push(accessArray(array, i));
    }
    for (let i = mid + 1; i <= right; i++) {
        rightArr.push(accessArray(array, i));
    }
    
    let i = 0, j = 0, k = left;
    
    updateStepInfo(
        `Merging sorted subarrays [${leftArr.join(',')}] and [${rightArr.join(',')}]`,
        null,
        null
    );
    await sleep(sortingSpeed * 2);
    
    // Merge the temporary arrays back
    while (i < leftArr.length && j < rightArr.length && !isPaused) {
        stats.stepCount++;
        stats.comparisons++;
        updateStats();
        
        highlightElements([k], 'current');
        
        if (leftArr[i] <= rightArr[j]) {
            array[k] = leftArr[i];
            updateStepInfo(
                `Placing ${leftArr[i]} from left subarray`,
                null,
                null
            );
            i++;
        } else {
            array[k] = rightArr[j];
            updateStepInfo(
                `Placing ${rightArr[j]} from right subarray`,
                null,
                null
            );
            j++;
        }
        
        stats.arrayAccesses++;
        k++;
        await sleep(sortingSpeed);
        renderArray();
    }
    
    // Copy remaining elements
    while (i < leftArr.length && !isPaused) {
        array[k] = leftArr[i];
        stats.arrayAccesses++;
        i++;
        k++;
        await sleep(sortingSpeed * 0.5);
        renderArray();
    }
    
    while (j < rightArr.length && !isPaused) {
        array[k] = rightArr[j];
        stats.arrayAccesses++;
        j++;
        k++;
        await sleep(sortingSpeed * 0.5);
        renderArray();
    }
    
    // Mark merged portion as sorted if it's the final merge
    if (left === 0 && right === array.length - 1) {
        for (let idx = left; idx <= right; idx++) {
            markAsSorted(idx);
        }
    }
}

// ===== QUICK SORT =====
async function quickSort(low, high) {
    if (low < high && !isPaused) {
        stats.passes++;
        
        updateStepInfo(
            `QuickSort: Partitioning range [${low + 1}-${high + 1}]`,
            'newPass',
            { 
                passNum: stats.passes,
                description: `We'll choose a pivot and partition elements around it.`
            }
        );
        await sleep(sortingSpeed * 1.5);
        
        const pivotIndex = await partition(low, high);
        
        if (!isPaused) {
            await quickSort(low, pivotIndex - 1);
            await quickSort(pivotIndex + 1, high);
        }
    }
}

async function partition(low, high) {
    const pivot = accessArray(array, high);
    let i = low - 1;
    
    highlightElements([high], 'pivot');
    updateStepInfo(
        `Chosen pivot: ${pivot} at position ${high + 1}`,
        null,
        null
    );
    await sleep(sortingSpeed * 2);
    
    for (let j = low; j < high && !isPaused; j++) {
        stats.stepCount++;
        updateStats();
        
        highlightElements([j, high], 'comparing');
        
        updateStepInfo(
            `Comparing ${array[j]} with pivot ${pivot}`,
            'compare',
            { 
                left: array[j], 
                right: pivot,
                reason: `Elements smaller than pivot go to the left partition.`
            }
        );
        await sleep(sortingSpeed * 1.5);
        
        if (!compare(array, j, high)) { // array[j] <= pivot
            i++;
            if (i !== j) {
                highlightElements([i, j], 'swapping');
                
                const leftVal = array[i];
                const rightVal = array[j];
                swap(array, i, j);
                
                updateStepInfo(
                    `Swapping ${leftVal} and ${rightVal}`,
                    'swap',
                    { 
                        left: leftVal, 
                        right: rightVal,
                        reason: `Moving smaller element to left partition.`
                    }
                );
                
                await sleep(sortingSpeed * 1.5);
                renderArray();
            }
        }
    }
    
    // Place pivot in correct position
    if (i + 1 !== high) {
        highlightElements([i + 1, high], 'swapping');
        
        const leftVal = array[i + 1];
        swap(array, i + 1, high);
        
        updateStepInfo(
            `Placing pivot ${pivot} in its correct position ${i + 2}`,
            'swap',
            { 
                left: leftVal, 
                right: pivot,
                reason: `Pivot goes between smaller and larger elements.`
            }
        );
        
        await sleep(sortingSpeed * 2);
        renderArray();
    }
    
    markAsSorted(i + 1);
    return i + 1;
}

// ===== HEAP SORT =====
async function heapSort() {
    const n = array.length;
    
    // Build max heap
    updateStepInfo(
        `Building max heap from array`,
        'newPass',
        { 
            passNum: 1,
            description: `First, we'll arrange elements to form a max heap structure.`
        }
    );
    await sleep(sortingSpeed * 2);
    
    for (let i = Math.floor(n / 2) - 1; i >= 0 && !isPaused; i--) {
        await heapify(n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0 && !isPaused; i--) {
        stats.passes++;
        
        highlightElements([0, i], 'swapping');
        
        const rootVal = array[0];
        const lastVal = array[i];
        swap(array, 0, i);
        
        updateStepInfo(
            `Moving max element ${rootVal} to sorted position ${i + 1}`,
            'swap',
            { 
                left: rootVal, 
                right: lastVal,
                reason: `The largest element in the heap goes to its final position.`
            }
        );
        
        await sleep(sortingSpeed * 2);
        renderArray();
        markAsSorted(i);
        
        // Restore heap property
        await heapify(i, 0);
    }
    
    markAsSorted(0);
}

async function heapify(n, i) {
    if (isPaused) return;
    
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    stats.stepCount++;
    updateStats();
    
    // Check if left child is larger
    if (left < n) {
        highlightElements([largest, left], 'comparing');
        await sleep(sortingSpeed);
        
        if (compare(array, left, largest)) {
            largest = left;
        }
    }
    
    // Check if right child is larger
    if (right < n) {
        highlightElements([largest, right], 'comparing');
        await sleep(sortingSpeed);
        
        if (compare(array, right, largest)) {
            largest = right;
        }
    }
    
    // If largest is not root
    if (largest !== i && !isPaused) {
        highlightElements([i, largest], 'swapping');
        
        const parentVal = array[i];
        const childVal = array[largest];
        swap(array, i, largest);
        
        updateStepInfo(
            `Heapifying: swapping ${parentVal} with ${childVal}`,
            'swap',
            { 
                left: parentVal, 
                right: childVal,
                reason: `Maintaining max heap property.`
            }
        );
        
        await sleep(sortingSpeed * 1.5);
        renderArray();
        
        // Recursively heapify the affected subtree
        await heapify(n, largest);
    }
}

// ===== PERFORMANCE COMPARISON =====
function updatePerformanceTable() {
    const tbody = elements.performanceTableBody;
    tbody.innerHTML = '';
    
    performanceData.forEach((data, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${algorithmInfo[data.algorithm].title}</td>
            <td>${data.timeTaken}ms</td>
            <td>${data.comparisons}</td>
            <td>${data.swaps}</td>
            <td>${data.arraySize}</td>
        `;
        
        // Highlight best performance
        if (index === 0 || data.timeTaken < Math.min(...performanceData.map(d => d.timeTaken))) {
            row.style.backgroundColor = '#e6fffa';
        }
    });
}

async function compareAllAlgorithms() {
    if (originalArray.length === 0) {
        alert('Please generate an array first');
        return;
    }
    
    const algorithms = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];
    const results = [];
    
    for (const algorithm of algorithms) {
        // Reset array
        array = [...originalArray];
        currentAlgorithm = algorithm;
        selectAlgorithm(algorithm);
        
        updateStepInfo(`Testing ${algorithmInfo[algorithm].title}...`);
        await sleep(500);
        
        // Run algorithm silently (disable audio)
        const audioState = elements.audioToggle.checked;
        elements.audioToggle.checked = false;
        
        const startTime = Date.now();
        resetStats();
        stats.startTime = startTime;
        
        await executeSort();
        
        const timeTaken = Date.now() - startTime;
        results.push({
            algorithm,
            timeTaken,
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            arraySize: originalArray.length
        });
        
        // Restore audio state
        elements.audioToggle.checked = audioState;
    }
    
    performanceData = results;
    updatePerformanceTable();
    elements.performanceSection.style.display = 'block';
    
    updateStepInfo('Performance comparison completed! Check the table below for results.');
    speakText('Performance comparison of all sorting algorithms is now complete. You can see the results in the table below.');
}
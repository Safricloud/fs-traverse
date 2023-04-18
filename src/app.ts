// This program will use the fs module to recursively traverse from a specified directory and run a callback function on each file that meets a
// condition function. Both the condition function and the callback function are passed in as parameters to the traverse function.

import * as fs from 'fs';
import * as path from 'path';

async function traverse(
    dir: string,
    condition: (file: string) => boolean,
    callback: (file: string) => Promise<void>
): Promise<void> {
    // Create a directory queue
    let queue: string[] = [];

    // Normalize the directory path
    const normalizedPath = path.normalize(dir);

    // Get the list of files in the directory
    let results = await fs.promises.readdir(normalizedPath);

    // Loop through the results
    for (let result of results) {
        // Get the full path of the item
        let fullPath = path.join(dir, result);

        // Get the stats for the item
        let stats = await fs.promises.stat(fullPath);

        // If the item is a directory, add it to the queue
        if (stats.isDirectory()) {
            queue.push(fullPath);
        }

        // If the item is a file, check if it meets the condition
        if (stats.isFile() && condition(fullPath)) {
            
            // If it meets the condition, call the callback function
            await callback(fullPath);
        }
    }

    // Loop through the queue
    for (let item of queue) {
        // Call traverse on each item in the queue
        await traverse(item, condition, callback);
    }
}

// Export the traverse function
export { traverse };

// Export for commonjs
if (typeof module !== 'undefined') {
    module.exports = { traverse };
    exports.default = { traverse };
}
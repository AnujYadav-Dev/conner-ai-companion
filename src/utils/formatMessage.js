// Utility function to format AI messages with markdown support
export const formatMessage = (content) => {
    if (!content) return '';

    // Convert markdown-style formatting to HTML
    let formatted = content;

    // First, handle horizontal rules (must be done first to avoid conflicts)
    formatted = formatted
        .replace(/^---$/gim, '<hr class="my-4 border-t border-gray-300 dark:border-gray-600">')
        .replace(/^___$/gim, '<hr class="my-4 border-t border-gray-300 dark:border-gray-600">')
        .replace(/^\*\*\*$/gim, '<hr class="my-4 border-t border-gray-300 dark:border-gray-600">');

    // Handle headers (must be done before other formatting)
    formatted = formatted
        .replace(/^##### (.*$)/gim, '<h5 class="text-base font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100 border-l-4 border-blue-500 pl-3">$1</h5>')
        .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100 border-l-4 border-blue-500 pl-3">$1</h4>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100 border-l-4 border-blue-500 pl-3">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100 border-l-4 border-blue-500 pl-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100 border-l-4 border-blue-500 pl-3">$1</h1>');

    // Handle blockquotes
    formatted = formatted
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-200 dark:border-blue-800 pl-4 py-2 my-3 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">$1</blockquote>');

    // Handle lists (must be done before inline formatting)
    formatted = formatted
        .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300">$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300">$1</li>');

    // Handle inline formatting (order matters to avoid conflicts)
    // First handle code blocks (most specific)
    formatted = formatted
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-sm font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">$1</code>');

    // Handle bold and italic (bold first, then italic)
    formatted = formatted
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');

    // Handle other inline formatting
    formatted = formatted
        .replace(/==([^=]+)==/g, '<mark class="bg-yellow-200 dark:bg-yellow-800/50 px-1 py-0.5 rounded">$1</mark>')
        .replace(/~~([^~]+)~~/g, '<del class="line-through text-gray-500 dark:text-gray-400">$1</del>')
        .replace(/__([^_]+)__/g, '<u class="underline decoration-blue-500 decoration-2">$1</u>');

    // Handle special tags
    formatted = formatted
        .replace(/\b(IMPORTANT|NOTE|TIP|WARNING|CAUTION)\b/gi, '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 mr-1">$1</span>');

    // Handle line breaks and lists
    formatted = formatted
        .replace(/\n/g, '<br>')
        .replace(/(<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300">.*<\/li>)/g, '<ul class="list-disc list-inside space-y-1 my-3">$1</ul>')
        .replace(/<\/ul><ul class="list-disc list-inside space-y-1 my-3">/g, '');

    // Handle paragraph wrapping (last step)
    formatted = formatted
        .replace(/<br><br>/g, '</p><p class="mb-3">')
        .replace(/^(?!<[h|u|b|d|m|e|s|p|d|H|B|Q|L|U|D|M|E|S|P|D])/gm, '<p class="mb-3">')
        .replace(/(?<!>)$/gm, '</p>')
        .replace(/<p class="mb-3"><\/p>/g, '')
        .replace(/<p class="mb-3"><br><\/p>/g, '');

    return formatted;
};

// Function to check if content has formatting
export const hasFormatting = (content) => {
    if (!content) return false;
    return /(\*\*.*?\*\*|\*.*?\*|`.*?`|^#+ |^- |^\d+\. |^> |==.*?==|~~.*?~~|__.*?__|\b(IMPORTANT|NOTE|TIP|WARNING|CAUTION)\b|^---$|^___$|^\*\*\*$)/gm.test(content);
};

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchArticlesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'keyword' => 'nullable|string|max:255',
            'date' => ['nullable', 'regex:/^\d{4}-\d{2}-\d{2} to \d{4}-\d{2}-\d{2}$/'],
            'category' => 'nullable|array',
            'category.*' => 'string|max:100',
            'source' => 'nullable|array',
            'source.*' => 'string|max:100',
            'author' => 'nullable|array',
            'author.*' => 'string|max:100',
        ];
    }
}

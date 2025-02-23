<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserPreferencesRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Ensure that the request is always authorized
    }

    public function rules()
    {
        return [
            'source' => ['nullable', 'array'],
            'source.*' => ['string', 'distinct', 'min:1'],
            'category' => ['nullable', 'array'],
            'category.*' => ['string', 'distinct', 'min:1'],
            'author' => ['nullable', 'array'],
            'author.*' => ['string', 'distinct', 'min:1'],
        ];
    }

    public function messages()
    {
        return [
            'source.*.string' => 'Each source must be a valid string.',
            'source.*.distinct' => 'Duplicate sources are not allowed.',
            'source.*.min' => 'Source cannot be empty.',

            'category.*.string' => 'Each category must be a valid string.',
            'category.*.distinct' => 'Duplicate categories are not allowed.',
            'category.*.min' => 'Category cannot be empty.',

            'author.*.string' => 'Each author must be a valid string.',
            'author.*.distinct' => 'Duplicate authors are not allowed.',
            'author.*.min' => 'Author name cannot be empty.',
        ];
    }
}

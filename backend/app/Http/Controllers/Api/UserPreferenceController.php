<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Interfaces\UserPreferenceServiceInterface;
use App\Http\Requests\UpdateUserPreferencesRequest; // ✅ Import Form Request

class UserPreferenceController extends Controller
{
    protected $userPreferenceService;

    public function __construct(UserPreferenceServiceInterface $userPreferenceService)
    {
        $this->userPreferenceService = $userPreferenceService;
    }

    public function updatePreferences(UpdateUserPreferencesRequest $request) // ✅ Use Form Request
    {
        $user = auth()->user();

        // Clean up request data
        $preferences = [
            'source' => array_filter($request->source ?? []), // ✅ Remove empty/null values
            'category' => array_filter($request->category ?? []),
            'author' => array_filter($request->author ?? []),
        ];

        return response()->json($this->userPreferenceService->updatePreferences($user, $preferences));
    }

    public function getPreferences()
    {
        return response()->json(auth()->user()->preferences);
    }

    public function getPersonalizedFeed()
    {
        return response()->json($this->userPreferenceService->getPersonalizedFeed(auth()->user()));
    }
}

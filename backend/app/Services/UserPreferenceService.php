<?php

namespace App\Services;

use App\Repositories\Interfaces\UserPreferenceRepositoryInterface;
use App\Repositories\Interfaces\ArticleRepositoryInterface;
use App\Services\Interfaces\UserPreferenceServiceInterface;
use App\Models\User;

class UserPreferenceService implements UserPreferenceServiceInterface
{
    protected UserPreferenceRepositoryInterface $userPreferenceRepository;
    protected ArticleRepositoryInterface $articleRepository;

    public function __construct(UserPreferenceRepositoryInterface $userPreferenceRepository, ArticleRepositoryInterface $articleRepository)
    {
        $this->userPreferenceRepository = $userPreferenceRepository;
        $this->articleRepository = $articleRepository;
    }

    public function updatePreferences(User $user, array $preferences)
    {
        return $this->userPreferenceRepository->updatePreferences($user, $preferences);
    }

    public function getPreferences(User $user)
    {
        return $this->userPreferenceRepository->getPreferences($user);
    }

    public function getPersonalizedFeed(User $user)
    {
        $preferences = $this->userPreferenceRepository->getPreferences($user);

        return $this->articleRepository->searchArticlesByPreferences($preferences);
    }
}

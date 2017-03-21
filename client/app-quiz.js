/**
 * Created by Julius Alvarado on 3/19/2017.
 */
(function () {
    "use strict";

    var app = angular.module('app-quiz', []),
        controllerId = 'QuizCtrl',
        factoryId = 'jDataSer';

    app.factory(factoryId, ['$http', jDataServiceClass]);
    app.controller(controllerId, ['$scope', '$sce', 'jDataSer', QuizCtrlClass]);

    function QuizCtrlClass($scope, $sce, jDataSer) {
        $scope.introMessage = 'Test your knowledge';
        $scope.score = 0;
        $scope.activeQuestion = -1;
        $scope.activeQuestionAnswered = 0;
        $scope.percentScore = 0;

        $scope.selectAnswer = function (indexQuestion, indexAnswer) {
            var questionState = $scope.myQuestions[indexQuestion].questionState;

            if (questionState != 'answered') { // .questionState is falsey because user has yet to click on an answer
                $scope.myQuestions[indexQuestion].selectedAnswer = indexAnswer;
                var correctAnswer = $scope.myQuestions[indexQuestion].correct;
                $scope.myQuestions[indexQuestion].correctAnswer = correctAnswer;

                if (indexAnswer === correctAnswer) {
                    $scope.myQuestions[indexQuestion].correctness = 'correct';
                    $scope.score += 1;
                } else {
                    $scope.myQuestions[indexQuestion].correctness = 'incorrect';
                }
                // now that user has clicked on an answer I now set .questionState
                $scope.myQuestions[indexQuestion].questionState = 'answered';
            }

            $scope.percentScore = (100 * ($scope.score / $scope.totalQuestions))
                .toFixed(2);
        };

        $scope.isSelected = function (qIndex, aIndex) {
            return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
        };

        $scope.isCorrect = function (qIndex, aIndex) {
            return $scope.myQuestions[qIndex].correctAnswer === aIndex;
        };

        $scope.selectContinue = function () {
            return $scope.activeQuestion += 1;
        };

        $scope.createShareLinks = function (percent) {
            var url = 'http://php1.julius3d.com';
            var emailLink = '<a href="mailto:?subject=Quiz Score.&amp;body=Beat my '+percent+
                '% quiz score at '+url+' studios." class="btn btn-sm btn-warning email">Email</a>';
            var tweetLink = '<a href="http://twitter.com/share?text=I scored '+percent+' on my AngularJS quiz. ' +
                'Beat my score at &hashtags=ngQuiz&url='+url+'" target="_blank" class="btn btn-sm btn-info twitter">Tweet</a>';

            var newMarkup = emailLink + tweetLink;
            return $sce.trustAsHtml(newMarkup);
        };

        activate();
        function activate() {
            jDataSer.getLocalQuizData().then(function (res) {
                $scope.myQuestions = res.data;
                $scope.totalQuestions = $scope.myQuestions.length;
            });
        }
    }

    function jDataServiceClass($http) {

        var getQuizData = function () {
            return $http.get('api/quiz/get-quiz-data.php?jtoken=public');
        };

        var getLocalQuizData = function () {
            return $http.get('quiz_data.json')
        };

        return {
            getQuizData: getQuizData,
            getLocalQuizData: getLocalQuizData
        }
    }
}());
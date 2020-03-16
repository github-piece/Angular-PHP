exports.getCategory = async function(req, res) {
    try {
        const userId = req.body.userId;
        if (userId == undefined) { res.status(200).send({error}) }
        var businessList = new Array();
        var result
        result = await mysql.execute("SELECT * FROM tbl_business");
        global.businessData = result[0];
        businessList.push({mainBusiness: businessData});
        result = await mysql.execute('SELECT * FROM tbl_business WHERE u_id = ?', [userId]);
        businessList.push({currentUserBusiness: result[0]});
        businessList.push({countryList: countryData});
        businessList.push({businessUser: userData});
        businessList.push({goalList: unsdgData});
        businessList.push({business_length: businessData.length});
        businessList.push({unSdg: getUnsdg()});
        businessList.push({interactions: await getInteractions()});
        businessList.push({stakeholders: await getStakeholders()});
        businessList.push({commission: commissionData});
        businessList.push({instruments: instrumentsData});
        res.status(200).send(businessList);
    } catch (error) {
        res.status(400).send({error})
    } 
}

function getUnsdg() {
    var unSdg = new Array();
    var unsdgItem  = new Array();
    businessData.forEach(item => {
        var goalNames = item['goal name'].split(',');
        unsdgItem.goal_number = [];
        unsdgItem.goal_description = [];
        unsdgItem.path = [];
        unsdgData.forEach(goal => {
            goalNames.forEach(goalName => {
                if (goal.goal_name == goalName) {
                    unsdgItem.goal_number.push(goal.goal_number);
                    unsdgItem.goal_description.push(goal.short_description);
                    unsdgItem.path.push(goal.path);
                }
            });
        });
        unSdg.push({goal_number: unsdgItem.goal_number, path: unsdgItem.path, goal_description: unsdgItem.goal_description});
    });
    return unSdg;
}

async function getInteractions() {
    unSdg = getUnsdg();
    var interactions = [];
    for (var i = 0; i < businessData.length; i++) {
        var interaction = {};
        unSdg[i].goal_number.forEach(async goal_number => {
            var data = await getResult(goal_number);
            interaction[goal_number] = data;
        });
        await sleep(10);
        interactions[i] = interaction;
    }
    return interactions;
}

async function getResult(goal_number) {
    var result = await mysql.execute('SELECT `goal_main`, `goal_alternative_1`, `interaction_1`, `key_points`, `key_uncertainties`, `comprehensive_breakdown`, `illustrative_example_1`, `key_dimensions_1`, `key_dimensions_2`, `key_dimensions_3`, `key_dimensions_4` FROM `tbl_unsdg_goal_interactions` WHERE `goal_main` = ? OR `goal_alternative_1` = ?', [goal_number, goal_number]);
    return result[0];
}

async function getStakeholders() {
    var stakeholders = new Array();
    stakeholders.push({country: await getStakeholderItem('Country')})
    stakeholders.push({button3: await getStakeholderItem('Button 3')})
    stakeholders.push({button4: await getStakeholderItem('Button 4')})
    stakeholders.push({consideration: await getStakeholderItem('Considerations')})
    stakeholders.push({maps: await getStakeholderMap(25)})
    return stakeholders;
}

async function getStakeholderItem(key) {
    var stakeholder = new Array();
    var stakeholders = new Array();
    const mysql = require('../connection')
    var result = await mysql.execute("SELECT `description` FROM tbl_catalogue_summary WHERE tab = 'Sustainability Measures' AND sub_tab = 'Stakeholders' AND button_in_sub_tab = ?", [key])
    var key_info = result[0];
    result = await mysql.execute("SELECT tbl_pull_request_1_source FROM tbl_catalogue_summary WHERE tab = 'Sustainability Measures' AND sub_tab = 'Stakeholders' AND button_in_sub_tab = ?", [key])
    var tables = result[0];
    businessData.forEach(async mainBusiness_item => {
        key_info.forEach(async function (key_info_item, index) {
            var countryName = mainBusiness_item['country']
            var col = key_info_item['description']
            var table = tables[index]['tbl_pull_request_1_source']
            if (index == 0) {
                result = await mysql.execute("SELECT * FROM " + table)
                content = result[0]
                content.forEach(content_item => {
                    if(content_item['country'] == countryName && content_item[col] != undefined) {
                        var result_col = {}
                        result_col[col] = content_item[col];
                        stakeholder.push(result_col);
                    }  
                });
            } else if (table != tables[index-1]['tbl_pull_request_1_source']) {
                result = await mysql.execute("SELECT * FROM " + table)
                content = result[0]
                content.forEach(content_item => {
                    if(content_item['country'] == countryName && content_item[col] != undefined) {
                        var result_col = {}
                        result_col[col] = content_item[col];
                        stakeholder.push(result_col);
                    }  
                });
            }
        });
        await sleep(10)
        stakeholders.push(stakeholder)
    });
    await sleep(10)
    return stakeholders
}

async function getStakeholderMap(id_business_quiz) {
    var stakeholders_map = new Array()
    var stakeholders_maps = new Array()
    businessData.forEach(async business_item => {
        var answer = await getAnswersByBusinessId(business_item['u_id'], business_item['business_id']);
        var answersById = await getAnswerById(answer, id_business_quiz)
        if (answersById[0] != undefined) {
            if (answersById[0]['col_0_header'] != null) {
                var stakeholders = answersById[0]['col_0_header'].split(',')
            } else {
                var stakeholders = null
            }
            if (answersById[0]['col_1_header'] != null) {
                var rings = answersById[0]['col_1_header'].split(',')
            } else {
                var rings = null
            }
            if (scoringData != null) {
                scoringData.forEach(stakeholderRing => {
                    var stakeholder_map = new Array()
                    if (rings != null) {
                        rings.forEach(function (ring, index) {
                            if(stakeholderRing['ring'] == ring) {
                                stakeholder_map.push(stakeholders[index])
                            }
                        });
                    }
                    stakeholders_map[stakeholderRing['ring']] = stakeholder_map
                    stakeholders_maps[stakeholderRing['ring']] = stakeholder_map
                });
            }
        }
    });
    return stakeholders_maps
}

async function getAnswersByBusinessId(userId, businessId) {
    const mysql = require('../connection')
    var result = await mysql.execute('SELECT * FROM tbl_business_answer WHERE u_id= ? AND business_id = ?', [userId, businessId]);
    return result[0];
}

async function getAnswerById(answer, id_business_quiz) {
    var answersById = new Array();
    answer.forEach(value => {
        if(value['id_business_quiz'] == id_business_quiz) {
            answersById.push(value)
        }
    });
    return answersById;
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
} 
